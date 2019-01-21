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

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIBase } from './api-base';
import { Controller } from './control/control.component';
import { SharedDataService } from './shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class ControlService extends APIBase {
  constructor(
    http: Http,
    sharedData: SharedDataService
  ) {
    super(http, sharedData);
  }

  load(): Observable<Controller[]> {
    const path = 'controllers';
    const url = `${SharedDataService.scheme}://${SharedDataService.moiraiAddress}/${path}`;
    return this.doGet(url).pipe(map((cs: Controller[]) => _.sortBy(cs, 'name')));
  }

  save(cs: Controller[]): Observable<any> {
    const path = 'controllers';
    const url = `${SharedDataService.scheme}://${SharedDataService.moiraiAddress}/${path}`;
    return this.doPost(url, cs);
  }

  run(controller: Controller): Observable<any> {
    const path = 'controllers/run';
    const url = `${SharedDataService.scheme}://${SharedDataService.moiraiAddress}/${path}`;
    return this.doPost(url, { controller: controller.id });
  }

  stopTest(): Observable<null> {
    const path = 'system_response/test/stop';
    const url = `${SharedDataService.scheme}://${SharedDataService.moiraiAddress}/${path}`;
    return this.doGet(url);
  }
}
