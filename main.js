const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const {Photos} = require('./photos.js');
let photos = null;

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, "icon.png")
  });
  photos = new Photos(mainWindow.webContents);
  mainWindow.loadFile('index.html');
}

// executed when app is initiallized
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on("add-image", (event, path)=>{
  var parts = path.split('.');
  var end = parts[parts.length - 1];
  end = end.toLowerCase()
  if (end == 'jpg' || end == 'png' || end == 'jpeg' || end == 'gif' || end == 'bmp'){
  photos.addPhoto(path);
}});