/*
Copyright (c) 2016 Álan Crístoffer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { MdSnackBar } from '@angular/material';
import { timer } from 'rxjs/observable/timer';
import { Subscription } from 'rxjs/Rx';
import { TranslateService } from './translation/translation.service'
import { Chart } from './chart.service';
import { LiveGraphService, Test, TestData, VariableRename } from './live_graph.service'
import { SharedData } from './shared_data.service';
import { Observable } from 'rxjs'

interface ExportVariable {
    variable: string
    exportName: string
    export: boolean
}

@Component({
    selector: 'live-graph',
    templateUrl: '../html/live_graph.htm'
})
export class LiveGraphComponent implements OnInit, OnDestroy {
    tests: Test[]

    test: Test
    testData: TestData[]
    testExportVariables: ExportVariable[]
    exportType: string = 'MAT'
    exportTypes: string[] = ['CSV', 'JSON', 'MAT']

    private timer: Observable<number>
    private timerSubscription: Subscription

    constructor(
        private http: Http,
        private toast: MdSnackBar,
        private i18n: TranslateService,
        private lg: LiveGraphService,
    ) {
    }

    ngOnInit() {
        this.lg.listTests().subscribe(
            (tests) => this.tests = tests,
            this.httpError()
        )

        this.timer = Observable.timer(1000, 1000)
        this.timerSubscription = this.timer.subscribe(() => {
            this.lg.listTests().subscribe(
                tests => {
                    if (!_.isEqual(tests, this.tests)) {
                        this.tests = tests
                    }
                },
                this.httpError()
            )

            if (this.test != null && this.testData != null) {
                const testName = this.test.name
                const testDate = this.test.date
                const testSkip = this.testData[0].points.length * this.testData.length
                this.lg.fetchTest(testName, testDate, testSkip).subscribe(
                    data => {
                        if (data.length > 0) {
                            const sensors = _.map(this.testData, 'sensor')
                            for (const sensor in sensors) {
                                const oldPoints = this.testData[sensor].points
                                const newPoints = data[sensor].points
                                const ps = _.concat(oldPoints, newPoints)
                                this.testData[sensor].points = ps
                            }
                        }
                    },
                    this.httpError()
                )
            }
        })
    }

    ngOnDestroy() {
        this.timerSubscription.unsubscribe()
    }

    loadTest(test: Test): void {
        this.lg.fetchTest(test.name, test.date).subscribe(
            data => {
                this.test = test
                this.testData = data
                this.testExportVariables = _.map(this.testData, d => {
                    return {
                        variable: d.sensor,
                        exportName: d.sensor,
                        export: true,
                    }
                })
            },
            this.httpError()
        )
    }

    removeTest(test: Test): void {
        if (this.test != null &&
            this.test.name == test.name &&
            this.test.date == test.date) {
            this.test = this.testData = this.testExportVariables = null
        }

        this.lg.removeTest(test).subscribe(
            () => this.tests = _.filter(this.tests, t => {
                return t.name != test.name || t.date != test.date
            }),
            this.httpError()
        )
    }

    saveTest(): void {
        if (_.isEmpty(this.testData) || _.isEmpty(this.testExportVariables)) {
            return
        }

        const dict: VariableRename = _
            .chain(this.testExportVariables)
            .filter(e => e.export)
            .map(f => {
                return { [f.variable]: f.exportName }
            })
            .reduce(_.assign, {})
            .value()

        const ds: TestData[] = _
            .chain(this.testData)
            .filter(t => _.has(dict, t.sensor))
            .map(d => {
                const e = _.cloneDeep(d)
                e.sensor = dict[d.sensor]
                return e
            })
            .value()

        if (this.exportType === 'JSON') {
            const time = _.map(_.first(ds).points, p => p.x.toString() as string)
            const ds2 = _.map(ds, d => {
                return {
                    variable: d.sensor,
                    points: _.map(d.points, p => p.y.toString())
                }
            })
            const tds = _.concat([{ variable: 't', points: time }], ds2)
            this.saveFile('data.json', JSON.stringify(tds))
        } else if (this.exportType === 'CSV') {
            const time = _.map(_.first(ds).points, p => p.x.toString())
            const data = _.map(ds, d => {
                return _.concat([`"${d.sensor}"`], _.map(d.points, p => p.y.toString()))
            })
            const tdata = _.concat(data, [_.concat(['"t"'], time)])
            console.log(tdata)
            const zd = _.zip.apply(_, tdata)
            const csv = _.join(zd, "\n")
            this.saveFile('data.csv', csv)
        } else if (this.exportType === 'MAT') {
            this.lg.downloadMAT(this.test, dict).subscribe(
                data => {
                    const link = document.createElement('a')
                    link.href = window.URL.createObjectURL(data.blob())
                    link.download = 'data.mat'
                    link.click()
                },
                this.httpError()
            )
        }
    }

    saveFile(fileName: string, text: string, type: string = 'text/plain'): void {
        const link = document.createElement('a')
        link.setAttribute('target', '_blank')
        link.setAttribute('href', `data:${type},${encodeURIComponent(text)}`)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    validateVariable(): void {
        for (const ev of this.testExportVariables) {
            ev.exportName = this.makeValidVariable(ev.exportName)
        }
    }

    httpError(): () => void {
        return () => {
            const str = 'Error when connecting. Check address and try again.'
            const message = this.i18n.instant(str)
            this.toast.open(message, null, { duration: 2000 })
        }
    }

    formatDate(date: string): string {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }

        return new Date(date).toLocaleString(this.i18n.currentLang, options)
    }

    private makeValidVariable(variable: string): string {
        const r1 = /[^A-Za-z0-9_]/g
        const r2 = /^[0-9]+/g
        return variable.replace(r1, '').replace(r2, '')
    }
}