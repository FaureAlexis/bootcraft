import { exec } from "../utils/exec";
import type { Disk, DiskPartition } from "../types/diskUtil";

class DiskUtil {
  private _parseDiskUtilList(diskInfo: string): Disk[] {
    const lines = diskInfo.split("\n");
    const disks: Disk[] = [];
    let currentDisk: Disk | null = null;

    for (const line of lines) {
      if (line.startsWith("/dev/")) {
        if (currentDisk) {
          disks.push(currentDisk);
        }

        const [device, type] = line.split(" (");
        currentDisk = {
          device: device.trim(),
          type: type.replace("):", "").trim(),
          partitions: []
        };
      } else if (currentDisk && line.trim().startsWith("#:")) {
        continue; // Skip the header line
      } else if (currentDisk) {
        const parts = line.split(/\s{2,}/).filter(Boolean); // Split by two or more spaces
        if (parts.length >= 4) {
          const partition: DiskPartition = {
            partitionType: parts[1]?.trim(),
            name: parts[2]?.trim(),
            size: parts[3]?.trim(),
            identifier: parts[4]?.trim()
          };
          currentDisk.partitions.push(partition);
        }
      }
    }

    if (currentDisk) {
      disks.push(currentDisk);
    }

    return disks;
  }

  public async list(): Promise<Disk[]> {
    const diskutilList = await exec("diskutil list");
    return this._parseDiskUtilList(diskutilList);
  }

  public async listExternal(): Promise<Disk[]> {
    const diskutilList = await exec("diskutil list external");
    return this._parseDiskUtilList(diskutilList);
  }

  public async eraseAndFormatDisk(device: string, name: string = "WINBOOT"): Promise<string> {
    const stdout = await exec(`diskutil eraseDisk MS-DOS ${name} MBR ${device}`);
    return stdout;
  }
}

export default new DiskUtil();
export { Disk };