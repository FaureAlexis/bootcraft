import diskUtil, { Disk } from "./services/diskUtil";
import os from "os";
import chalk from "chalk";
import { selectUserDisk, confirmEraseDisk, getNewVolumeName, selectWindowsIso } from "./prompts";
import windowsImage from "./services/windowsImage";
import { print, printError, printWarning, printInfo } from "./utils/print";
import wimLib from "./services/wimLib";
import loadingAnimation from "./utils/loader";

const main = async () => {
  if (os.platform() !== "darwin") {
    printError("This program only supports macOS.");
    return -1;
  }
  print("Welcome to WinBoot!");
  
  const diskutilList: Disk[] = await diskUtil.listExternal();
  
  
  if (!diskutilList.length) {
    printError("No external disks found.");
    return -1;
  }
  
  const userDisk: Disk = await selectUserDisk(diskutilList);
  const erase: boolean = await confirmEraseDisk(userDisk);

  if (!erase) {
    printWarning("Aborting.");
    return 0;
  }
  
  const newVolumeName = await getNewVolumeName();
  
  const eraseLoader = loadingAnimation(`Erasing ${userDisk.device}...`);
  try {
    await diskUtil.eraseAndFormatDisk(userDisk.device);
    clearInterval(eraseLoader);
    printInfo(`\nErased ${userDisk.device}!`);
  } catch (error) {
    clearInterval(eraseLoader);
    return -1;
  }

  print(`Created ${newVolumeName} on ${userDisk.device}!`);
  printInfo('Looking for Windows ISOs...');
  
  const isoFiles = windowsImage.getIsoFiles();
  const selectedIsoFile = await selectWindowsIso(isoFiles);
  
  print(`Selected ${selectedIsoFile}!`);
  
  printInfo('Flashing Windows ISO to disk...');
  
  await windowsImage.flashImageToDisk(selectedIsoFile, `/Volumes/${newVolumeName}`);
  
  await wimLib.init();
  await wimLib.splitWim(`/Volumes/${newVolumeName}/sources/install.wim`, `/Volumes/${newVolumeName}/sources/install.swm`);
  
  return 0;
};

main();
