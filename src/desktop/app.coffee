###
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
###
{app, BrowserWindow, Menu} = require( 'electron' )

windows = []

createWindow = () ->
    win = new BrowserWindow
        width: 800
        height: 600
    win.loadURL "file:#{__dirname}/index.htm"
    win.on 'closed', () ->
        windows = (w for w in windows when w != win)
    win.maximize()
    windows.push win

app.on 'ready', ->
    menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    createWindow()
app.on 'window-all-closed', () ->
    if process.platform != 'darwin'
        app.quit()

app.on 'activate', () ->
    if windows.length == 0
        createWindow()

template = [
    label: 'Edit'
    submenu: [
        {role: 'undo'}
        {role: 'redo'}
        {type: 'separator'}
        {role: 'cut'}
        {role: 'copy'}
        {role: 'paste'}
        {role: 'pasteandmatchstyle'}
        {role: 'delete'}
        {role: 'selectall'}
    ]
,
    label: 'View'
    submenu: [
        label: 'Reload'
        accelerator: 'CmdOrCtrl+R'
        click: (item, focusedWindow) ->
          focusedWindow.reload() if focusedWindow
    ,
        label: 'Toggle Developer Tools'
        accelerator: process.platform == 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I'
        click: (item, focusedWindow) ->
          focusedWindow.webContents.toggleDevTools() if focusedWindow
    ,
      {type: 'separator'}
      {role: 'resetzoom'}
      {role: 'zoomin'}
      {role: 'zoomout'}
      {type: 'separator'}
      {role: 'togglefullscreen'}
    ]
,
    role: 'window'
    submenu: [
      {role: 'minimize'}
      {role: 'close'}
    ]
,
    role: 'help'
    submenu: [
        label: 'Learn More'
        click: () -> require('electron').shell.openExternal('http://electron.atom.io')
    ]
]

if process.platform == 'darwin'
    template.unshift(
        label: app.getName(),
        submenu: [
            {role: 'about'}
            {type: 'separator'}
            {
                role: 'services',
                submenu: []
            }
            {type: 'separator'}
            {role: 'hide'}
            {role: 'hideothers'}
            {role: 'unhide'}
            {type: 'separator'}
            {role: 'quit'}
        ]
    )

    template[1].submenu.push(
        {type: 'separator'}
        {
          label: 'Speech'
          submenu: [
            {role: 'startspeaking'}
            {role: 'stopspeaking'}
          ]
        }
    )

    template[3].submenu = [
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W'
          role: 'close'
        }
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M'
          role: 'minimize'
        }
        {
          label: 'Zoom'
          role: 'zoom'
        }
        {type: 'separator'}
        {
          label: 'Bring All to Front'
          role: 'front'
        }
    ]
