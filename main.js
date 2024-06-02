const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const lineReader = require('line-reader');
const fs = require('fs');
const path = require('path');

// Manage app creation

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
      contextIsolation: true,
      nodeIntegration: true
  }
  });

  win.loadFile('src/homepage.html');
}

app.whenReady().then(() => {
    window = createWindow();
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { // Keep application open in background on Darwin OS
      app.quit();
    };
});


// IPC handling

ipcMain.handle('open-dialog', async () => {
  const result = await dialog.showOpenDialog({
    title: "HanziHub - Import File",
    filters: [
      { "name": "Text File", "extensions": ["txt", "text"], },
    ],
    properties: ['openFile']
  });

  // Create character list

  fs.readFile(result.filePaths[0], 'utf8', (err, data) => { 
    if (err) { // Catch error when reading file
      console.error(err);
      return;
    }

    let character_list = [];
    data = data.split("");
    data.forEach(function(character) {
      if (character.match(/[\u3400-\u9FBF]/)) {
        character_list.push(character);
      };
    });
    character_list = new Set(character_list);
    character_list = [...character_list].join("");

    fs.writeFile('user-storage/character-list.txt', character_list, err => {
      if (err) { // Catch error when writing file
        console.error(err);
      }
    });
  });

  // Create phrase list

  const allFileContents = fs.readFileSync(result.filePaths[0], 'utf-8');
  let phrase_list = "";
  let formatted_line = "";
  allFileContents.split(/\r?\n/).forEach(line =>  {
    if (line !== "Time		Subtitle		Translation") {
      formatted_line = line.substring(11) + "\n";
      split_formatted_line = formatted_line.split("	");
      formatted_line = split_formatted_line[0] + "\n" + split_formatted_line[split_formatted_line.length - 1] + "\n";
      phrase_list += formatted_line;
    }
  });

  fs.writeFile('user-storage/phrase-list.txt', phrase_list, err => {
    if (err) { // Catch error when writing file
      console.error(err);
    }
  });
  
});
