const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const homedir = require('os').homedir();
const fs = require('fs');
const path = require('path');

// Manage app creation

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'visuals/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
      contextIsolation: true,
      nodeIntegration: true
  }
  });

  win.setMenu(null);
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
  if (!fs.existsSync(homedir + '/hanzihub-cache/')) {
    fs.mkdirSync(homedir + '/hanzihub-cache/');
  }
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

    fs.writeFile(path.join(homedir, 'hanzihub-cache/character-list.txt'), character_list, err => {
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
      formatted_line = split_formatted_line[0].trimEnd() + "\n" + split_formatted_line[split_formatted_line.length - 1].trimEnd() + "\n";
      phrase_list += formatted_line;
      phrases = ""
      phrase_list.split(/\r?\n/).forEach(line =>  {
        if (line !== ""){
          phrases += line += "\n";
        }
      })
    }
  });

  fs.writeFile(path.join(homedir, 'hanzihub-cache/phrase-list.txt'), phrases, err => {
    if (err) { // Catch error when writing file
      console.error(err);
    }
  });
  
});

ipcMain.handle('fetch-char-len', async () => {
  if (!fs.existsSync(homedir + '/hanzihub-cache/')) {
    fs.mkdirSync(homedir + '/hanzihub-cache/');
  }
  try {
    const data = await fs.promises.readFile(path.join(homedir, 'hanzihub-cache/character-list.txt'), 'utf8');
    return data.length;
  } catch (err) {
    console.error(err);
    return 0; // Return 0 or another appropriate value in case of error
  }
});

ipcMain.handle('fetch-char', async (event, index) => {
  if (!fs.existsSync(homedir + '/hanzihub-cache/')) {
    fs.mkdirSync(homedir + '/hanzihub-cache/');
  }
  try {
    const data = await fs.promises.readFile(path.join(homedir, 'hanzihub-cache/character-list.txt'), 'utf8');
    return data.charAt(index);
  } catch (err) {
    return "？"; 
  }
});

ipcMain.handle('fetch-phrases', async () => {
  if (!fs.existsSync(homedir + '/hanzihub-cache/')) {
    fs.mkdirSync(homedir + '/hanzihub-cache/');
  }
  try {
    let arr = []
    const data = await fs.promises.readFile(path.join(homedir, 'hanzihub-cache/phrase-list.txt'), 'utf8');
    data.split(/\r?\n/).forEach(line =>  {
      if (line.match(/[\u3400-\u9FBF]/)) {
        arr.push(line);
      }
    });
    return arr;
  } catch (err) {
    return [""]; 
  }
});

ipcMain.handle('fetch-translations', async () => {
  if (!fs.existsSync(homedir + '/hanzihub-cache/')) {
    fs.mkdirSync(homedir + '/hanzihub-cache/');
  }
  try {
    let arr = []
    const data = await fs.promises.readFile(path.join(homedir, 'hanzihub-cache/phrase-list.txt'), 'utf8');
    data.split(/\r?\n/).forEach(line =>  {
      if (!line.match(/[\u3400-\u9FBF]/)) {
        arr.push(line);
      }
    });
    return arr;
  } catch (err) {
    return [""]; 
  }
});