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

import { SharedData } from './shared_data.service'
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs'
import { map } from "rxjs/operators"

export class APIBase {
    protected constructor(
        protected http: Http,
        protected sharedData: SharedData
    ) { }

    protected doGet(url: string): Observable<any> {
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SharedData.accessToken}`
        })
        const options = new RequestOptions({ headers: headers })
        const observable = this.http.get(url, options)
        return observable.pipe(map((res: Response) => res.json()))
    }

    protected doPost(url: string, data: any, type: string = 'application/json'): Observable<any> {
        const headers = new Headers({
            'Accept': type,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SharedData.accessToken}`
        })
        const options = new RequestOptions({ headers: headers })
        const observable = this.http.post(url, data, options)
        return observable.pipe(map((res: Response) => res.json()))
    }
}
