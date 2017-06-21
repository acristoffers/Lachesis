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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { MdSnackBar } from '@angular/material';
import { timer } from 'rxjs/observable/timer';
import { Subscription } from 'rxjs/Rx';
import { TranslateService } from './translation/translation.service'
import { Chart } from './chart.service';
import { LiveGraphService, Test, TestData } from './live_graph.service'
import { SharedData } from './shared_data.service';
import { Observable } from 'rxjs'

@Component({
    selector: 'live-graph',
    templateUrl: '../html/live_graph.htm'
})
export class LiveGraphComponent implements OnInit, OnDestroy {
    tests: Test[]

    test: Test
    testData: TestData[]

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
                (tests) => this.tests = tests,
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
            },
            this.httpError()
        )
    }

    removeTest(test: Test): void {
        if (this.test != null &&
            this.test.name == test.name &&
            this.test.date == test.date) {
            this.test = this.testData = null
        }

        this.lg.removeTest(test).subscribe(
            () => this.tests = _.filter(this.tests, t => {
                return t.name != test.name || t.date != test.date
            }),
            this.httpError()
        )
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
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        }

        return new Date(date).toLocaleString(this.i18n.currentLang, options)
    }
}
