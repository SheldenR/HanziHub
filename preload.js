const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openDialog: () => ipcRenderer.invoke('open-dialog'),
    fetchCharLength: () => ipcRenderer.invoke('fetch-char-len'),
    fetchChar: (index) => ipcRenderer.invoke('fetch-char', index)
});

