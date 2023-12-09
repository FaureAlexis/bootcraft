import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { printError } from '../utils/print';
import { exec } from '../utils/exec';

const homeDirsToIgnore = [
  'Applications',
  'Library',
  'Pictures',
  'node_modules',
  'tmp',
];

class WindowsImage {
  private _mountPoint: string | null = null;
  // return a list of iso files under ~ recursively except 
  public getIsoFiles(): string[] {
    const isoFiles: string[] = [];
    const homeDir = os.homedir();
    const walkSync = (dir: string, filelist: string[] = []) => {
      try {
        const files = fs.readdirSync(dir);
        
        // remove homeDirsToIgnore from files
        homeDirsToIgnore.forEach((homeDirToIgnore: string) => {
          const index = files.indexOf(homeDirToIgnore);
          if (index > -1) {
            // console.log(`Removing ${homeDirToIgnore} from ${dir}`);
            files.splice(index, 1);
          }
        });

        // remove files or dirs starting with .
        const dotFiles = files.filter((file: string) => file.startsWith('.'));
        dotFiles.forEach((dotFile: string) => {
          const index = files.indexOf(dotFile);
          if (index > -1) {
            // console.log(`Removing ${dotFile} from ${dir}`);
            files.splice(index, 1);
          }
        });

        files.forEach((file: string) => {
          const filePath = path.join(dir, file);
          try {
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
              filelist = walkSync(filePath, filelist);
            } else if (stat.isFile() && file.endsWith('.iso')) {
              filelist.push(filePath);
            }
          } catch (error) {
            printError(`Error reading ${filePath}: ${error}`)
          }
        });
      } catch (error) {
        printError(`Error reading ${dir}: ${error}`)
      }
      return filelist;
    };

    return walkSync(homeDir);
  }

  private _copyImageToDisk(imageFile: string, disk: string): Promise<string> {
    return exec(`rsync -avh --progress --exclude=sources/install.wim ${imageFile}/* ${disk}`);
  }
  
  private async _unmountIso(): Promise<void> {
    if (this._mountPoint) {
      await exec(`hdiutil unmount ${this._mountPoint}`);
    }
  }

  private async _mountIso(isoFile: string): Promise<string> {
    const mountPoint = await exec(`hdiutil mount ${isoFile}`);
    this._mountPoint = mountPoint.split('\t')[0];
    return mountPoint.trim();
  }


  public async flashImageToDisk(imageFile: string, disk: string): Promise<string> {
    const mountPoint = await this._mountIso(imageFile);
    const result = await this._copyImageToDisk(mountPoint, disk);
    await this._unmountIso();
    return result;
  }

}

export default new WindowsImage();