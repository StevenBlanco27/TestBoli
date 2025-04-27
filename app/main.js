const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        fullscreen: true,
        kiosk: true,
        toolbar: false,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        title: "Frosch",
        icon: path.join(__dirname, 'icono.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // Necesario para usar require en renderer
        }
    });

    win.loadURL(`file://${__dirname}/main.html`);

    // Solo abre DevTools en modo desarrollo
    // if (!app.isPackaged) {
    //     win.webContents.openDevTools();
    // }

    // Recibir errores desde el renderer
    ipcMain.on('log-error', (event, mensaje) => {
        const log = `[Renderer Error] ${new Date().toISOString()} ${mensaje}\n`;
        const filePath = path.join(__dirname, 'errores.txt');
        fs.appendFile(filePath, log, (err) => {
            if (err) console.error('Error escribiendo el log:', err);
        });
    });
}

// Opcional: Desactivar aceleración de hardware si quieres aún más rápido
// app.disableHardwareAcceleration();

app.whenReady().then(createWindow);
