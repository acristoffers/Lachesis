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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { APIBase } from './api-base';
import { ChartService, DataPoint } from './chart.service';
import { SharedDataService } from './shared-data.service';

export interface ResponseTest {
  id: number;
  name: string;
  type: string;
  inputs: string[];
  output: string | string[];
  points: DataPoint[];
  fixedOutputs: PortValue[];
  afterOutputs: PortValue[];
  logRate: number;
}

export interface PortValue {
  alias: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class SystemResponseService extends APIBase {
  constructor(
    http: HttpClient,
    sharedData: SharedDataService
  ) {
    super(http, sharedData);
  }

  loadTests(): Observable<ResponseTest[]> {
    const path = '/system_response/tests';
    const url = this.urlFor(path);
    return this.doGet(url);
  }

  saveTests(tests: ResponseTest[]): Observable<any> {
    const path = '/system_response/tests';
    const url = this.urlFor(path);
    return this.doPost(url, tests);
  }

  runTest(test: ResponseTest): Observable<any> {
    const path = '/system_response/test/run';
    const url = this.urlFor(path);
    return this.doPost(url, { test: test.id });
  }

  stopTest(): Observable<null> {
    const path = '/system_response/test/stop';
    const url = this.urlFor(path);
    return this.doGet(url);
  }

  createChart(id: string, labels: string[], colors: string[], ...dataPoints: DataPoint[][]): ChartService {
    const chart = new ChartService(id, [{ sensor: '', points: _.first(dataPoints) }]);
    chart.setPoints(_.first(dataPoints));
    return chart;
  }
}
