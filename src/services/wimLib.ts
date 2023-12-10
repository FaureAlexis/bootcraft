import { exec } from "../utils/exec";
import { confirmInstallWimLib, confirmInstallHomebrew } from "../prompts";
import { print, printWarning, printInfo, printError } from "../utils/print";

class WimLib {
  private async _checkHomebrew(): Promise<boolean> {
    try {
      await exec("brew help");
      return true;
    } catch (error) {
      return false;
    }
  }

  private async _installHomebrew(): Promise<boolean> {
    try {
      await exec("/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"");
      return this._checkHomebrew();
    } catch (error) {
      printError(`Error installing Homebrew: ${error}`);
      return false;
    }
  }

  private async _installWimLib(): Promise<boolean> {
    if (await this._checkHomebrew()) {
      try {
        await exec("brew install wimlib");
        return true;
      } catch (error) {
        printError(`Error installing wimlib-imagex: ${error}`);
        return false;
      }
    }
    return false;
  }
  
  private async _checkWimLib(): Promise<boolean> {
    try {
      await exec("wimlib-imagex --help");
      return true;
    } catch (error) {
      return false;
    }
  }

  public async init(): Promise<boolean> {
    printInfo("Checking for wimlib-imagex...");
    if (await this._checkWimLib()) {
      print("Found wimlib-imagex!");
      return true;
    } else {
      printWarning("wimlib-imagex not found.");
      const installWimLib = await confirmInstallWimLib();
      if (installWimLib) {
        printInfo("Checking for Homebrew...");
        if (await this._checkHomebrew()) {
          print("Found Homebrew!");
        } else {
          printWarning("Homebrew not found.");
          const installHomebrew = await confirmInstallHomebrew();
          if (installHomebrew) {
            printInfo("Installing Homebrew...");
            await this._installHomebrew();
            print("Installed Homebrew!");
          } else {
            printWarning("Aborting.");
            return false;
          }
        }
        printInfo("Installing wimlib-imagex...");
        await this._installWimLib();
        print("Installed wimlib-imagex!");
        return true;
      } else {
        printWarning("Aborting.");
        return false;
      }
    }
  }

  public async splitWim(wimFile: string, outputDir: string, segmentSize: number = 4000): Promise<string> {
    return exec(`wimlib-imagex split ${wimFile} ${outputDir} ${segmentSize}`);
    // This "4000" parameter specifies the maximum size for each segment. 
    // Considering that the maximum file size for MS-DOS (FAT32) is 4096MB, this value is set just below the limit.
    // You may choose to reduce this size if preferred, but ensure it remains slightly under the maximum.
  }
}

export default new WimLib();