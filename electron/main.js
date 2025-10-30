const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
// YAML parsing is handled in the renderer (Settings.jsx) via js-yaml

let win = null;
const childWindows = new Set();

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
    },
  });

  win.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173');

  ['maximize', 'unmaximize', 'enter-full-screen', 'leave-full-screen'].forEach(evt => {
    win.on(evt, () => {
      win.webContents.send('window-state', {
        isMaximized: win.isMaximized(),
        isFullScreen: win.isFullScreen(),
      });
    });
  });

  win.on('closed', () => (win = null));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (win === null) createWindow(); });

ipcMain.handle('win:minimize', () => BrowserWindow.getFocusedWindow()?.minimize());

ipcMain.handle('win:close', () => BrowserWindow.getFocusedWindow()?.close());

ipcMain.handle('win:maxToggle', () => {
  const w = BrowserWindow.getFocusedWindow();
  if (w) w.isMaximized() ? w.unmaximize() : w.maximize();
});

ipcMain.handle('win:fsToggle', () => {
  const w = BrowserWindow.getFocusedWindow();
  if (w) w.setFullScreen(!w.isFullScreen());
});

ipcMain.handle('open-window', (_evt, route = '') => {
  const child = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
    },
  });

  childWindows.add(child);
  child.on('closed', () => childWindows.delete(child));

  const devURL = 'http://localhost:5173';
  const fullURL = `${devURL}#/${route}`;
  console.log('Opening new window with URL:', fullURL);
  
  child.loadURL(fullURL);

  // If the child has its own custom titlebar:
  ['maximize','unmaximize','enter-full-screen','leave-full-screen'].forEach(evt => {
    child.on(evt, () => {
      child.webContents.send('window-state', {
        isMaximized: child.isMaximized(),
        isFullScreen: child.isFullScreen(),
      });
    });
  });
});

const configPath = path.join(__dirname, '..', 'zipline.config.yaml');
// No auto-init or default file logic.

ipcMain.handle('config:read', async () => {
  try {
    if (!fs.existsSync(configPath)) return '';
    return fs.readFileSync(configPath, 'utf-8');
  } catch (err) {
    console.error('Error reading config:', err);
    return '';
  }
});

ipcMain.handle('config:write', async (_evt, newData) => {
  try {
    const text = typeof newData === 'string' ? newData : String(newData ?? '');
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, text, 'utf-8');
    
    // Parse YAML to extract theme and bgColor, broadcast to all windows
    try {
      const yaml = require('yaml');
      const config = yaml.parse(text);
      if (config?.theme) {
        // Broadcast theme change to all windows
        BrowserWindow.getAllWindows().forEach(win => {
          win.webContents.send('theme-changed', config.theme);
        });
      }
      if (config?.bgColor) {
        // Broadcast bgColor change to all windows
        BrowserWindow.getAllWindows().forEach(win => {
          win.webContents.send('bgcolor-changed', config.bgColor);
        });
      }
    } catch (parseErr) {
      // Not a YAML file or parsing failed, skip broadcast
    }
    
    return true;
  } catch (err) {
    console.error('Error writing config:', err);
    return false;
  }
});

