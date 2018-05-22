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

import * as _ from 'lodash'

import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http'
import { Observable } from 'rxjs'
import { map } from "rxjs/operators"
import { SharedData } from './shared_data.service'
import { APIBase } from './api_base'
import { DataPoint } from './chart.service'

export interface Test {
    name: string
    date: Date
    running: boolean
}

export interface TestData {
    sensor: string
    points: DataPoint[]
}

export interface VariableRename {
    [key: string]: string
}

@Injectable()
export class LiveGraphService extends APIBase {
    constructor(
        http: Http,
        sharedData: SharedData
    ) {
        super(http, sharedData)
    }

    listTests(): Observable<Test[]> {
        const path = 'live_graph/tests'
        const url = `${SharedData.scheme}://${SharedData.moiraiAddress}/${path}`
        return this.doGet(url)
    }

    fetchTest(name: string, start: Date, skip = 0): Observable<TestData[]> {
        const path = 'live_graph/test'
        const url = `${SharedData.scheme}://${SharedData.moiraiAddress}/${path}`
        const data = {
            test: name,
            start_time: start,
            skip: skip
        }

        return this.doPost(url, data).pipe(map(rs => {
            const sensors = _.uniq(_.map(rs, 'sensor')) as string[]
            return _.map(sensors, s => {
                return {
                    sensor: s,
                    points: _.map(_.filter(rs, r => r['sensor'] == s), r => {
                        return {
                            x: r['time'],
                            y: r['value']
                        }
                    })
                }
            })
        }))
    }

    downloadMAT(test: Test, variables: VariableRename): Observable<Response> {
        const path = 'live_graph/test/export'
        const url = `${SharedData.scheme}://${SharedData.moiraiAddress}/${path}`
        const data = {
            test: test.name,
            start_time: test.date,
            variables: variables
        }

        const headers = new Headers({
            'Accept': 'application/octet-stream',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SharedData.accessToken}`
        })

        const options = new RequestOptions({
            headers: headers,
            responseType: ResponseContentType.Blob
        })

        return this.http.post(url, data, options)
    }

    removeTest(test: Test): Observable<void> {
        if (test.running) {
            return this.stopTest()
        } else {
            const path = 'live_graph/test/remove'
            const url = `${SharedData.scheme}://${SharedData.moiraiAddress}/${path}`
            const data = {
                test: test.name,
                start_time: test.date
            }
            return this.doPost(url, data)
        }
    }

    removeAll(tests: Test[]): Observable<void> {
        const running = _.head(_.filter(tests, t => t.running))
        if (running != null) {
            this.stopTest().subscribe()
        }

        const path = 'live_graph/test/remove'
        const url = `${SharedData.scheme}://${SharedData.moiraiAddress}/${path}`
        const ts = _.map(tests, t => {
            return {
                test: t.name,
                start_time: t.date
            }
        })
        return this.doPost(url, ts)
    }

    stopTest(): Observable<void> {
        const path = 'system_response/test/stop'
        const url = `${SharedData.scheme}://${SharedData.moiraiAddress}/${path}`
        return this.doGet(url)
    }
}
