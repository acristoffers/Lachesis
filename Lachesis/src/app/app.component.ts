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

import { Component, NgZone, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ipcRenderer } from 'electron';
import * as settings from 'electron-settings';
import * as $ from 'jquery';
import './ace-imports';
import { TranslateService } from './translation/translation.service';

@Component({
  selector: 'lachesis-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public connectionToken: string;
  public sidebarOpen = true;

  constructor(
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private zone: NgZone
  ) {
    ipcRenderer.on('check-for-updates', () => {
      this.zone.run(() => {
        const msg = this.translate.instant('Checking for updates...');
        this.snackBar.open(msg, '', {
          duration: 5000,
        });
      });
    });

    ipcRenderer.on('update-not-available', () => {
      this.zone.run(() => {
        const msg = this.translate.instant('No update available');
        this.snackBar.open(msg, '', {
          duration: 5000,
        });
      });
    });

    ipcRenderer.on('error', () => {
      this.zone.run(() => {
        const msg = this.translate.instant('Error checking for updates');
        this.snackBar.open(msg, '', {
          duration: 5000,
        });
      });
    });

    ipcRenderer.on('update-downloaded', () => {
      this.zone.run(() => {
        const msg = this.translate.instant('Update downloaded. Restart to apply.');
        this.snackBar.open(msg, 'Restart', {
        }).onAction().subscribe(() => {
          ipcRenderer.send('restart', null);
        });
      });
    });

    ipcRenderer.on('update-available', () => {
      this.zone.run(() => {
        const msg = this.translate.instant('Update available.');
        const bmsg = this.translate.instant('Download');
        this.snackBar.open(msg, bmsg, {
          duration: 60000,
        }).onAction().subscribe(() => {
          ipcRenderer.send('download-update', null);
        });
      });
    });

    ipcRenderer.on('download-progress', (_: any, download: any) => {
      this.zone.run(() => {
        const tmp = this.translate.instant('Downloading ($1)');
        const msg = tmp.replace('$1', download.percent.toFixed(0));
        this.snackBar.open(msg, '', {
          duration: 2000,
        });
      });
    });
  }

  ngOnInit() {
    const lang = settings.get('language', 'en') as string;
    this.translate.use(lang);
    $('[unresolved]').removeAttr('unresolved');
  }
}
