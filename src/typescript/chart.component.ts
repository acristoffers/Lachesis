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
import { Component, Input, AfterViewChecked } from '@angular/core'
import { Chart, DataPoint } from './chart.service'
import { ChartEvent } from 'canvasjs'

@Component({
    selector: 'chart',
    templateUrl: '../html/chart.html'
})
export class ChartComponent implements AfterViewChecked {
    chart: Chart
    private _points: DataPoint[] = []

    @Input()
    sensor: string

    @Input()
    syncZoomFunction: (e: ChartEvent) => void = null

    @Input()
    set points(points: DataPoint[]) {
        if (this.chart != null) {
            if (!_.isEqual(points, this._points)) {
                if (points.length > this._points.length) {
                    const ps = points.slice(this._points.length)
                    this.chart.appendPoints(ps, 0)
                } else {
                    this.chart.setPoints(points)
                }

                this._points = points
            }
        } else {
            // If chart is null, it will be created in the future. Just keep the
            // points so they appear when the chart gets created (ms from now).
            this._points = points
        }
    }

    get points() {
        return this._points
    }

    ngAfterViewChecked() {
        if (this.chart == null) {
            this.chart = new Chart(this.sensor, '', 'line', this.points)
            const opts = this.chart.chartReference.options as any
            opts.rangeChanged = this.syncZoomFunction
        }
    }
}
