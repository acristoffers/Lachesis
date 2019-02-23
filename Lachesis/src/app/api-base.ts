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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedDataService } from './shared-data.service';

export class APIBase {
  protected constructor(
    protected http: HttpClient,
    protected sharedData: SharedDataService
  ) { }

  protected doGet(url: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SharedDataService.accessToken}`
    });
    const options = { headers: headers };
    const observable = this.http.get(url, options);
    return observable.pipe(map(res => JSON.parse(JSON.stringify(res))));
  }

  protected doPost(url: string, data: any, type: string = 'application/json'): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': type,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SharedDataService.accessToken}`
    });
    const options = { headers: headers };
    const observable = this.http.post(url, data, options);
    return observable.pipe(map(res => JSON.parse(JSON.stringify(res))));
  }

  protected urlFor(path: string): string {
    return `${SharedDataService.scheme}://${SharedDataService.moiraiAddress}${path}`;
  }
}
