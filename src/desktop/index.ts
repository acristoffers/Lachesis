/*
Copyright (c) 2016 Álan Crístoffer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { app, shell, BrowserWindow, Menu, ipcMain } from 'electron'
import { autoUpdater } from "electron-updater"
import * as log from 'electron-log'
import { CancellationToken } from 'builder-util-runtime/out/CancellationToken';

let window: Electron.BrowserWindow = null
const token = new CancellationToken

function createWindow(): Electron.BrowserWindow {
    const win = new BrowserWindow({
        show: false,
        icon: `file://${__dirname}/imgs/icon.png`
    })
    win.loadURL(`file://${__dirname}/index.html`)
    win.on('closed', () => {
        window = null
    })
    win.once('ready-to-show', () => {
        win.show()
        win.maximize()
    })
    window = win
    return win
}

app.on('ready', () => {
    log.transports.file.level = "debug"
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()

    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    createWindow()

    autoUpdater.on('update-available', info => {
        window.webContents.send('update-available', info)
    })

    autoUpdater.on('update-not-available', info => {
        window.webContents.send('update-not-available', info)
    })

    autoUpdater.on('download-progress', progress => {
        window.webContents.send('update-progress', progress)
    })

    autoUpdater.on('update-downloaded', info => {
        window.webContents.send('update-downloaded', info)
    })

    autoUpdater.on('error', error => {
        window.webContents.send('update-error', error)
    })

    ipcMain.on('check-for-updates', () => {
        autoUpdater.checkForUpdates()
    })

    ipcMain.on('download-update', () => {
        autoUpdater.downloadUpdate(token)
    })

    ipcMain.on('restart', () => {
        autoUpdater.quitAndInstall()
    })
})

app.on('window-all-closed', app.quit)

const editMenu: Electron.MenuItemConstructorOptions = {
    label: 'Edit',
    submenu: [
        {
            role: 'undo'
        }, {
            role: 'redo'
        }, {
            type: 'separator'
        }, {
            role: 'cut'
        }, {
            role: 'copy'
        }, {
            role: 'paste'
        }, {
            role: 'pasteandmatchstyle'
        }, {
            role: 'delete'
        }, {
            role: 'selectall'
        }
    ]
}

const viewMenu: Electron.MenuItemConstructorOptions = {
    label: 'View',
    submenu: [
        {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    return focusedWindow.reload();
                }
            }
        }, {
            label: 'Toggle Developer Tools',
            accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    return focusedWindow.webContents.toggleDevTools();
                }
            }
        }, {
            type: 'separator'
        }, {
            role: 'resetzoom'
        }, {
            role: 'zoomin'
        }, {
            role: 'zoomout'
        }, {
            type: 'separator'
        }, {
            role: 'togglefullscreen'
        }
    ]
}

const windowMenu: Electron.MenuItemConstructorOptions = {
    role: 'window',
    submenu: [
        {
            role: 'minimize'
        }, {
            role: 'close'
        }
    ]
}

const helpMenu: Electron.MenuItemConstructorOptions = {
    role: 'help',
    submenu: [
        {
            label: 'Learn More',
            click: function () {
                shell.openExternal('http://electron.atom.io');
            }
        },
        {
            label: 'Check For Update',
            click: function () {
                window.webContents.send('check-for-updates', null)
                autoUpdater.checkForUpdates()
            }
        }
    ]
}

const template: Electron.MenuItemConstructorOptions[] = [
    editMenu, viewMenu, windowMenu, helpMenu
];

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            {
                role: 'about'
            }, {
                type: 'separator'
            }, {
                role: 'services',
                submenu: []
            }, {
                type: 'separator'
            }, {
                role: 'hide'
            }, {
                role: 'hideothers'
            }, {
                role: 'unhide'
            }, {
                type: 'separator'
            }, {
                role: 'quit'
            }
        ]
    })

    template[3].submenu = [
        {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        }, {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        }, {
            label: 'Zoom',
            role: 'zoom'
        }, {
            type: 'separator'
        }, {
            label: 'Bring All to Front',
            role: 'front'
        }
    ]
}
