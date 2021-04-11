const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'electron',
  {
    addPhoto: (filename) => ipcRenderer.send('add-image', filename),
    ipcOn: (channel, f) => ipcRenderer.on(channel, f)
  }
)
