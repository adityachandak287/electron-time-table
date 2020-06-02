const { screen, app, BrowserWindow, ipcMain, Menu, Tray } = require("electron");
const path = require("path");

const iconPath = path.join(__dirname, "..", "static", "tray_icon.png");

var windowByName = {};
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const calcWidth = parseInt(width * 0.2);
  const mainWindow = new BrowserWindow({
    width: calcWidth,
    height: height,
    x: width - calcWidth,
    y: 0,
    darkTheme: true,
    autoHideMenuBar: "true",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.on("minimize", function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  // mainWindow.on("close", function (event) {
  //   if (!application.isQuiting) {
  //     event.preventDefault();
  //     mainWindow.hide();
  //   }

  //   return false;
  // });

  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: function () {
        mainWindow.show();
      },
    },
    {
      label: "Quit",
      click: function () {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);
  tray.setToolTip("VIT Time Table");
  tray.on("double-click", (event) => {
    event.preventDefault();
    mainWindow.show();
  });
  tray.setContextMenu(contextMenu);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// ipcMain.on("test", (event, arg) => {
//   console.log("TEST");
// });
ipcMain.on("set-time-table", (event, arg) => {
  // console.log("main receiving sync", arg);
  // console.log("event sender", event.sender);
  windowByName["first"] = event.sender;
  if (BrowserWindow.getAllWindows().length === 1) {
    const setTimeTableWindow = new BrowserWindow({
      width: 800,
      height: 600,
      darkTheme: true,
      autoHideMenuBar: "true",
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });

    setTimeTableWindow.loadFile(path.join(__dirname, "time-table-form.html"));
  }
});

ipcMain.on("time-table-is-set", (event, arg) => {
  if (windowByName["first"]) {
    windowByName["first"].webContents.send("get-time-table-req", "server-ping");
  }
});

// ipcMain.on("synchronous-message", (event, arg) => {
//   console.log("main receiving sync", arg); // prints "ping"
//   event.returnValue = "pong";
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
