/* eslint-disable no-console */
import chalk from "chalk";

/**
 * Utility functions to print messages in the console.
 * I enforced eslint no-console rule in the project and disabled it here so IDE will 
 * prompt error if we don't use theses functions to log messages.
 */

chalk.level = 1; 
const print = (message: string) => console.log(chalk.greenBright(message));
const printError = (message: string) => console.log(chalk.redBright(message));
const printWarning = (message: string) => console.log(chalk.yellow(message));
const printInfo = (message: string) => console.log(chalk.blue(message));

export { print, printError, printWarning, printInfo };