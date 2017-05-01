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

import { app, shell, BrowserWindow, Menu } from 'electron'

let windows: Electron.BrowserWindow[] = []

function createWindow(): Electron.BrowserWindow {
    const win = new BrowserWindow({
        show: false,
        icon: `file://${__dirname}/imgs/icon.png`
    })
    win.loadURL(`file://${__dirname}/index.htm`)
    win.on('closed', () => {
        windows = windows.filter((e) => { return e != win })
    })
    win.once('ready-to-show', () => {
        win.show()
        win.maximize()
    })
    windows.push(win)
    return win
}

app.on('ready', () => {
    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (windows.length == 0) {
        createWindow()
    }
})

let editMenu: Electron.MenuItemOptions = {
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

let viewMenu: Electron.MenuItemOptions = {
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

let windowMenu: Electron.MenuItemOptions = {
    role: 'window',
    submenu: [
        {
            role: 'minimize'
        }, {
            role: 'close'
        }
    ]
}

let helpMenu: Electron.MenuItemOptions = {
    role: 'help',
    submenu: [
        {
            label: 'Learn More',
            click: function () {
                shell.openExternal('http://electron.atom.io');
            }
        }
    ]
}

let template: Electron.MenuItemOptions[] = [
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
