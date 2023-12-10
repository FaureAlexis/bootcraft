import prompts from 'prompts';
import { Disk } from '../services/diskUtil';

export const selectUserDisk = async (disks: Disk[]): Promise<Disk> => {
  const choices = disks.map((disk) => {
    return {
      title: disk.device,
      value: disk
    };
  });

  const response = await prompts({
    type: 'select',
    name: 'disk',
    message: 'Select a disk to install to',
    choices
  });

  return response.disk;
}

export const confirmEraseDisk = async (disk: Disk): Promise<boolean> => {
  const response = await prompts({
    type: 'confirm',
    name: 'erase',
    message: `Are you sure you want to erase ${disk.device}?`
  });

  return response.erase;
}

export const getNewVolumeName = async (): Promise<string> => {
  const response = await prompts({
    type: 'text',
    name: 'volumeName',
    message: 'Enter a name for the new volume',
    initial: 'Bootcraft'
  });

  return response.volumeName;
}

export const selectWindowsIso = async (isoFiles: string[]): Promise<string> => {
  const choices = isoFiles.map((isoFile) => {
    return {
      title: isoFile,
      value: isoFile
    };
  });

  const response = await prompts({
    type: 'select',
    name: 'isoFile',
    message: 'Select a Windows ISO to install',
    choices
  });

  return response.isoFile;
}

export const confirmInstallWimLib = async (): Promise<boolean> => {
  const response = await prompts({
    type: 'confirm',
    name: 'installWimLib',
    message: 'Bootcraft requires wimlib-imagex to flash Windows images. Would you like to install it now?'
  });

  return response.installWimLib;
}

export const confirmInstallHomebrew = async (): Promise<boolean> => {
  const response = await prompts({
    type: 'confirm',
    name: 'installHomebrew',
    message: 'Bootcraft requires Homebrew to install wimlib-imagex. Would you like to install it now?'
  });

  return response.installHomebrew;
}