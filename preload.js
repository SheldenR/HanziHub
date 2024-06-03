const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openDialog: () => ipcRenderer.invoke('open-dialog'),
    fetchCharLength: () => ipcRenderer.invoke('fetch-char-len'),
    fetchChar: (index) => ipcRenderer.invoke('fetch-char', index),
    fetchPhrases: () => ipcRenderer.invoke('fetch-phrases'),
    fetchTranslations: () => ipcRenderer.invoke('fetch-translations')
});

