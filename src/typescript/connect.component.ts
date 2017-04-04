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

import { Component, ApplicationRef } from '@angular/core'
import { Http, Response } from '@angular/http'
import { MdSnackBar } from '@angular/material'
import { TranslateService } from './translation/translation.service'
import { SharedData } from './shared_data.service'

@Component({
    selector: 'connect',
    templateUrl: 'connect.htm'
})
export class ConnectComponent {
    private connectionAddress = 'localhost:5000'
    private connectionPassword = ''

    constructor(
        private http: Http,
        private toast: MdSnackBar,
        private i18n: TranslateService,
        private applicationRef: ApplicationRef
    ) {
    }

    connect() {
        const url = `http://${this.connectionAddress}/login`
        const postData = { password: this.connectionPassword }
        const observer = this.http.post(url, postData)
        observer.subscribe(this.loginSuccessiful(), this.httpError())
    }

    loginSuccessiful() {
        const self: ConnectComponent = this
        return (res: Response) => {
            const data = res.json()
            SharedData.accessToken = data['token']
            self.applicationRef.tick()
        }
    }

    httpError() {
        const self: ConnectComponent = this
        return (error: any) => {
            if (!error.ok) {
                let str: string
                if (error.status == 403) {
                    str = 'Wrong password.'
                } else {
                    str = 'Error when connecting. Check address and try again.'
                }
                const message = self.i18n.instant(str)
                self.toast.open(message, null, { duration: 2000 })
            }
        }
    }

    disconnect() {
        SharedData.accessToken = null
        this.applicationRef.tick()
    }

    isLoggedIn() {
        return SharedData.accessToken != null
    }
}
