import chalk from "chalk";

chalk.level = 1; 
const print = (message: string) => console.log(chalk.greenBright(message));
const printError = (message: string) => console.log(chalk.redBright(message));
const printWarning = (message: string) => console.log(chalk.yellow(message));
const printInfo = (message: string) => console.log(chalk.blue(message));

export { print, printError, printWarning, printInfo };