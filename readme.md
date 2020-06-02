# Electron Time Table

<img src="https://img.shields.io/badge/electron-9.0.0-black?logo=electron" alt="electron 9.0.0" />

Electron app to show college Time Table.

## Run locally

```cmd
npm install
npm start
```

## Package to Windows .exe files

```cmd
npm run package-win-32
npm run package-win-64
```

Files will be available in `release-builds` folder.

## Make distributables for Windows x64

```cmd
npm run make
```

Files will be available in `out` folder.

## Download executable

Head over to [releases](https://github.com/adityachandak287/electron-time-table/releases) to download the latest release.

1. Download appropriate zip file
2. Extract
3. Run `VIT-Time-Table.exe`

## How to use?

Main window on first launch

<img src="screenshots/Main%20Window_1.PNG" width="172px" height="480px" alt="Main Window_1"/>

On clicking on Set Time Table

<img src="screenshots/Set%20Time%20Table%20Window_1.PNG" width="400px" height="300px" alt="Set Time Table Window_1"/>

Copy Time Table from VTOP

<img src="screenshots/copy_demo.gif" width="400px" height="300px" alt="Set Time Table Window_1"/>

Paste it into the textarea and click set time-table to parse the data and store the result for future use.

<img src="screenshots/Set%20Time%20Table%20Window_2.PNG" width="400px" height="300px" alt="Set Time Table Window_2"/>

Main window once Time Table is set

<img src="screenshots/Main%20Window_2.PNG" width="172px" height="480px" alt="Main Window_2"/>

## To-Do:

- [ ] Show upcoming class
- [ ] Colour out completed classes
- [ ] System notification for upcoming class
- [ ] setInterval to udpate day
