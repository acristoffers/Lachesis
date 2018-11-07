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
import { Component, Input, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core'
import { Chart } from './chart.service'
import { TestData } from './live_graph.service'

@Component({
    selector: 'chart',
    templateUrl: '../html/chart.html',
    styleUrls: ['./node_modules/dygraphs/dist/dygraph.min.css']
})
export class ChartComponent implements AfterViewChecked, OnChanges {
    private lastVarLength = 0
    private lastPointsLength = 0
    chart: Chart

    @Input()
    id: string

    @Input()
    lines: TestData[]

    ngOnChanges(changes: SimpleChanges): void {
        const td: TestData[] = [{ points: [], sensor: '' }]

        const varLength = (changes.lines.currentValue || []).length
        const pointsLength = (_.first(changes.lines.currentValue as TestData[] || td) || td[0]).points.length

        const hasNewVars = varLength != this.lastVarLength
        const hasNewPoints = pointsLength != this.lastPointsLength

        this.lastVarLength = varLength
        this.lastPointsLength = pointsLength

        if (this.chart != null && (hasNewVars || hasNewPoints)) {
            this.chart.setTestData(this.lines)
        }
    }

    ngAfterViewChecked() {
        if (this.chart == null) {
            this.chart = new Chart(this.id, this.lines)
        }
    }
}
