const { contextBridge, ipcRenderer } = require('electron');

// dev guard so HMR doesn’t re-bind
function exposeOnce(key, api) {
  try {
    if (!globalThis[`__EXPOSED_${key}__`]) {
      contextBridge.exposeInMainWorld(key, api);
      globalThis[`__EXPOSED_${key}__`] = true;
    }
  } catch {}
}

exposeOnce('winctl', {
  minimize: () => ipcRenderer.invoke('win:minimize'),
  close:    () => ipcRenderer.invoke('win:close'),
  maxToggle:() => ipcRenderer.invoke('win:maxToggle'),
  fsToggle: () => ipcRenderer.invoke('win:fsToggle'),
  onState:  (cb) => ipcRenderer.on('window-state', (_e, s) => cb(s)),
});

exposeOnce('electronAPI', {
  openWindow: (route) => ipcRenderer.invoke('open-window', route),
});

exposeOnce('configAPI', {
  read: () => ipcRenderer.invoke('config:read'),
  write: (data) => ipcRenderer.invoke('config:write', data),
  onThemeChange: (cb) => ipcRenderer.on('theme-changed', (_e, theme) => cb(theme)),
  onBgColorChange: (cb) => ipcRenderer.on('bgcolor-changed', (_e, bgColor) => cb(bgColor)),
});

console.log('[preload] loaded');
