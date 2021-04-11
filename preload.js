const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'electron',
  {
    addPhoto: (filename) => ipcRenderer.send('add-image', filename),
    ipcSend: (channel, c) => ipcRenderer.send(channel, c),
    ipcOn: (channel, f) => ipcRenderer.on(channel, f)
  }
)
