const { ipcMain, ipcRenderer } = require("electron");

function addimg(image) {
    ipcRenderer.send("add-image", image)
}
