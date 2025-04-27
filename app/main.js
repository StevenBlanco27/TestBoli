const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const homeOrTmp = require('home-or-tmp');

function createWindow() {
    const win = new BrowserWindow({
        fullscreen: true,
        kiosk: true,
        toolbar: false,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        title: "Frosch",
        icon: `${__dirname}/icono.png`,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // Necesario para usar require en renderer
        }
    });

    win.loadURL(`file://${__dirname}/main.html`);
    win.webContents.openDevTools(); // Muestra DevTools (consola)

    // Recibir errores desde el renderer
    ipcMain.on('log-error', (event, mensaje) => {
        const log = `[Renderer Error] ${new Date().toISOString()} ${mensaje}\n`;
        const filePath = path.join(homeOrTmp(), 'errores.txt');
        fs.appendFile(filePath, log, (err) => {
            if (err) console.error('Error escribiendo el log:', err);
        });
    });
}

app.whenReady().then(createWindow);
