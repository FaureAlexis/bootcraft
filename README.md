# Bootcraft

Tired of trying several different tools to create a bootable Windows USB drive on Mac? Me too.

This is my personal cli tool for creating bootable Windows USB drives from ISOs.

## How it works

Bootcraft performs the following steps:
- erase and format the USB drive to MS-DOS
- mount the ISO using [hdiutil](https://ss64.com/osx/hdiutil.html)
- flash the contents of the ISO to the USB drive using [rsync](https://ss64.com/osx/rsync.html)
- copy the `install.wim` file from the ISO to the USB drive using [wimlib-imagex](https://wimlib.net/) (this is the file that contains the Windows installation and is too large to be copied using rsync)
- unmount the ISO and USB drive


## Requirements

- [pnpm](https://pnpm.io/) (or npm or yarn) for installing dependencies
- [Node.js](https://nodejs.org/en/) for running the script

## Installation

In the future, I'll probably make this available via Homebrew. For now, you can install it manually:

```bash
git clone git@github.com:FaureAlexis/bootcraft.git
cd bootcraft
pnpm install
```

## Usage

```bash
pnpm start
```

## License

[MIT](https://choosealicense.com/licenses/mit/)


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## TODO

Coming soon

