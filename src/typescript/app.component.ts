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

import { ipcRenderer } from 'electron'
import { OnInit, Component, NgZone } from '@angular/core'
import * as settings from 'electron-settings'
import { TranslateService } from './translation/translation.service'
import { MatSnackBar } from '@angular/material'

@Component({
    selector: '[app]',
    templateUrl: '../html/app.html'
})
export class AppComponent implements OnInit {
    public connectionToken: string
    public sidebarOpen: boolean = true

    constructor(
        private translate: TranslateService,
        private snackBar: MatSnackBar,
        private zone: NgZone
    ) {
        ipcRenderer.on('check-for-updates', () => {
            this.zone.run(() => {
                this.snackBar.open('Checking for updates...', '', {
                    duration: 5000,
                })
            })
        })

        ipcRenderer.on('update-not-available', () => {
            this.zone.run(() => {
                this.snackBar.open('No update available', '', {
                    duration: 5000,
                })
            })
        })

        ipcRenderer.on('error', () => {
            this.zone.run(() => {
                this.snackBar.open('Error checking for updates', '', {
                    duration: 5000,
                })
            })
        })

        ipcRenderer.on('update-downloaded', () => {
            this.zone.run(() => {
                this.snackBar.open('Update downloaded. Restart to apply.', 'Restart', {
                    duration: 60000,
                }).onAction().subscribe(() => {
                    ipcRenderer.send('restart', null)
                })
            })
        })

        ipcRenderer.on('update-available', () => {
            this.zone.run(() => {
                this.snackBar.open('Update available.', 'Download', {
                    duration: 60000,
                }).onAction().subscribe(() => {
                    ipcRenderer.send('download-update', null)
                })
            })
        })

        ipcRenderer.on('download-progress', (download: any) => {
            this.zone.run(() => {
                this.snackBar.open(`Downloading (${download.transferred}/${download.total})`, '', {
                    duration: 2000,
                })
            })
        })
    }

    ngOnInit() {
        const lang = settings.get('language', 'en') as string
        this.translate.use(lang)
        $('[unresolved]').removeAttr('unresolved')
    }
}
