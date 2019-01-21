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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationRef, Component, NgZone } from '@angular/core';
import { Response } from '@angular/http';
import { MatSnackBar } from '@angular/material';
import * as _ from 'lodash';
import * as semver from 'semver';
import { SharedDataService } from '../shared-data.service';
import { TranslateService } from '../translation/translation.service';

interface Token {
  token: string;
}

@Component({
  selector: 'lachesis-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent {
  private expectedMoiraiVersion = '1.2.4';

  working = false;
  private connections: string[] = [];
  private connectionAddress = 'localhost:5000';
  private connectionPassword = '';
  private newPassword: string;
  private newPasswordConfirmation: string;

  constructor(
    private http: HttpClient,
    private toast: MatSnackBar,
    private i18n: TranslateService,
    private applicationRef: ApplicationRef,
    private zone: NgZone
  ) {
    if (SharedDataService.moiraiAddress != null) {
      this.connectionAddress = SharedDataService.moiraiAddress;
    }

    const connectionsJson = localStorage.getItem('connections') || '[]';
    this.connections = JSON.parse(connectionsJson);
  }

  connect(): void {
    this.working = true;
    const version = `${SharedDataService.scheme}://${this.connectionAddress}/version`;
    this.http.get(version).subscribe((v: any) => {
      if (semver.lt(v.version, this.expectedMoiraiVersion)) {
        const str = 'Moirai is outdated. Cannot connect.';
        const message = this.i18n.instant(str);
        this.toast.open(message, null, { duration: 2000 });
        return;
      }

      const url = `${SharedDataService.scheme}://${this.connectionAddress}/login`;
      const postData = { password: this.connectionPassword };
      const observer = this.http.post<Token>(url, postData);
      observer.subscribe(this.loginSuccessiful(), this.httpError());
    }, this.httpError());
  }

  loginSuccessiful(): (data: Token) => void {
    const self: ConnectComponent = this;
    return (data: Token) => {
      this.working = false;
      this.connections.push(this.connectionAddress);
      this.connections = _.uniq(this.connections).slice(-5);
      localStorage.setItem('connections', JSON.stringify(this.connections));
      SharedDataService.accessToken = data.token;
      SharedDataService.moiraiAddress = this.connectionAddress;
      this.connectionPassword = '';
      self.applicationRef.tick();
    };
  }

  disconnect(): void {
    SharedDataService.accessToken = null;
    this.applicationRef.tick();
  }

  isLoggedIn(): boolean {
    return SharedDataService.accessToken != null;
  }

  setPassword(): void {
    if (this.newPassword !== this.newPasswordConfirmation) {
      const str = 'Something went wrong. Please try again later.';
      const message = this.i18n.instant(str);
      this.toast.open(message, null, { duration: 2000 });
    } else {
      const headers = new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SharedDataService.accessToken}`
      });
      const options = { headers: headers };
      const url = `${SharedDataService.scheme}://${this.connectionAddress}/set-password`;
      const postData = { password: this.newPassword };
      const observer = this.http.post(url, postData, options);
      this.newPassword = this.newPasswordConfirmation = '';
      observer.subscribe(() => {
        this.working = false;
        const str = 'Success!';
        const message = this.i18n.instant(str);
        this.toast.open(message, null, { duration: 2000 });
      }, this.httpError());
      this.working = true;
    }
  }

  backup(): void {
    const headers = new HttpHeaders({
      'Accept': 'application/octet-stream',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SharedDataService.accessToken}`
    });
    const options = {
      headers: headers,
      responseType: 'blob' as 'blob'
    };
    const url = `${SharedDataService.scheme}://${this.connectionAddress}/db/dump`;
    this.http.get(url, options).subscribe(
      data => {
        this.working = false;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.download = 'dump.zip';
        link.click();
      },
      this.httpError()
    );
    this.working = true;
  }

  restore(): void {
    const url = `${SharedDataService.scheme}://${this.connectionAddress}/db/restore`;

    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = () => {
      this.zone.run(() => {
        const file = input.files[0];
        const formData = new FormData();
        formData.append('file', file);

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${SharedDataService.accessToken}`
        });

        const options = { headers: headers };
        this.http.post(url, formData, options).subscribe(
          () => {
            this.working = false;
            this.disconnect();
          },
          this.httpError()
        );

        this.working = true;
      });
    };
    input.click();
  }

  httpError(): (res: Response) => void {
    const self: ConnectComponent = this;
    return (error: any) => {
      this.working = false;
      if (!error.ok) {
        let str: string;
        if (error.status === 403) {
          str = 'Wrong password.';
        } else {
          str = 'Error when connecting. Check address and try again.';
        }
        const message = self.i18n.instant(str);
        self.toast.open(message, null, { duration: 2000 });
      }
    };
  }

  fillLogin(address: string) {
    this.connectionAddress = address;
  }
}
