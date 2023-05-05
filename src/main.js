const { app, BrowserWindow, ipcMain, dialog} = require('electron');
const fs = require('fs');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    minWidth: 450,
    minHeight: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  win.loadFile('src/index.html')
};

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


ipcMain.handle('saveMarkdown', async (event, content) => {
  const saveDialogOptions = {
    title: 'Save Markdown File',
    filters: [{ name: 'Markdown Files', extensions: ['md', 'markdown'] }],
  };

  const { canceled, filePath } = await dialog.showSaveDialog(saveDialogOptions);
  if (!canceled && filePath) {
    try {
      fs.writeFileSync(filePath, content);
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }
});
