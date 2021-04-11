const {app, BrowserWindow, ipcMain} = require('electron');
const pathlib = require('path');
const fs = require('fs')
const {Photos} = require('./photos.js');
let photos = null;

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: pathlib.join(__dirname, 'preload.js')
    },
    icon: pathlib.join(__dirname, "icon.png")
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

function processFileOrDirectory(path){
  fs.stat(path, (err, stat) => {
    if(err){
      //do nothing because there was an error
    }else{
      if(stat.isFile()){
        if(path.toLowerCase().includes(".jpg") || path.toLowerCase().includes(".jpeg") || path.toLowerCase().includes(".png") || path.toLowerCase().includes(".gif") || path.toLowerCase().includes(".bmp")){
          photos.addPhoto(path);
        }
      }else if(stat.isDirectory()){
        fs.readdir(path, (err, files) => {
          if(err){
            //do nothing because there was an error
          }else{
            files.forEach((f)=>{
              let new_path = pathlib.join(path, f)
              processFileOrDirectory(new_path)
            })
          }
        })
      }else{
        //I'm not dealing with your symbolic links you wierdo
      }
    }
  })
}

ipcMain.on("add-image", (event, path)=>{
  processFileOrDirectory(path)
});

ipcMain.on("search", (event, query)=>{
  photos.filter(query);
});