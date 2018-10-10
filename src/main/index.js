import { app, BrowserWindow, Menu, Tray, ipcMain } from 'electron' // eslint-disable-line
const path = require('path');

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9081'
  : `file://${__dirname}/index.html`;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 360,
    height: 478,
    frame: false,
    backgroundColor: '#fff',
    useContentSize: true,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}
function createTray() {
  let appTray = null;
  appTray = new Tray(path.join(__dirname, '../img/logo.png'));

  // const menuTemp = [
  //   {
  //     label: '退出',
  //     click: () => {
  //       mainWindow.show()
  //     },
  //   },
  // ];
  // const menu = Menu.buildFromTemplate(menuTemp);


  appTray.setToolTip('pomorodo');
  // appTray.setContextMenu(menu);
  appTray.on('click', () => {
    mainWindow.show();
  });
}

app.on('ready', () => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('pomodoro:close-window', () => {
  mainWindow.close();
  appTray.close();
});
ipcMain.on('pomodoro:min-window', () => {
  mainWindow.minimize();
});

