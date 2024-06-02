const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openDialog: (options) => ipcRenderer.invoke('open-dialog', options)
});