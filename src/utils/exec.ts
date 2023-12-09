import * as childProcess from 'child_process';

export const exec = async (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      resolve(stdout);
    });
  });
}