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
import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core'
import { Chart, DataPoint } from './chart.service'
import { SystemResponseService, ResponseTest, PortValue } from './system_response.service'
import { HardwareService, PortConfiguration, Types } from './hardware.service'
import { Observable } from 'rxjs'

@Component({
    selector: 'free-response',
    templateUrl: '../html/system_response.free.html'
})
export class SystemResponseFreeComponent implements AfterViewInit {
    private _test: ResponseTest
    private chart: Chart

    importText: string
    inputs: [string, boolean][]
    outputs: string[]

    @Input()
    get test() {
        return this._test
    }

    set test(test: ResponseTest) {
        this._test = test
        this.plotPoints()
        this.testChange.emit(test)
    }

    @Output() testChange = new EventEmitter<ResponseTest>()

    // Too long to fit in HTML. Was breaking.
    csvText = 'CSV: x in first column, y in second. Use csvwrite("data.csv", transpose([x; y])) in MATLAB/Octave to generate such file from x and y variables.'

    constructor(
        private service: SystemResponseService,
        private hardware: HardwareService
    ) {
    }

    ngAfterViewInit(): void {
        this.hardware.getConfiguration().subscribe(([driver, ports, calibration, locks]) => {
            const isInput = (p: PortConfiguration) => (p.type & Types.Input) > 0
            const isOutput = (p: PortConfiguration) => (p.type & (Types.Output | Types.PWM)) > 0

            this.inputs = _.map(_.filter(ports, isInput), p => [p.alias, false] as [string, boolean])
            this.outputs = _.map(_.filter(ports, isOutput), p => p.alias)
            const cs = _.map(calibration, c => [c.alias, _.filter(ports, p => p.id === c.port)[0]] as [string, PortConfiguration])
            this.inputs = _.concat(this.inputs, _.map(_.filter(cs, c => isInput(c[1])), c => [c[0], false] as [string, boolean]))
            this.outputs = _.concat(this.outputs, _.map(_.filter(cs, c => isOutput(c[1])), c => c[0]))

            this.inputs = _.map(this.inputs, i => [i[0], _.includes(this.test.inputs, i[0])] as [string, boolean])
            this.plotPoints()
        })
    }

    addFixedOutput(): void {
        this.test.fixedOutputs.push({ alias: '', value: 0 })
    }

    removeFixedOutput(output: PortValue): void {
        this.test.fixedOutputs = _.filter(this.test.fixedOutputs, f => f !== output)
    }

    addAfterOutput(): void {
        this.test.afterOutputs.push({ alias: '', value: 0 })
    }

    removeAfterOutput(output: PortValue): void {
        this.test.afterOutputs = _.filter(this.test.afterOutputs, f => f !== output)
        this.plotPoints()
    }

    addPoint(): void {
        this.test.points.push({ x: 0, y: 0 })
        this.plotPoints()
    }

    removePoint(point: DataPoint): void {
        this.test.points = _.filter(this.test.points, f => f !== point)
    }

    importData(): void {
        const t = this.importText
        try {
            this.test.points = _.sortBy(JSON.parse(t), ['x']) as DataPoint[]
        } catch (e) {
            const lines = _.filter(t.split("\n"), t => t.length > 0)
            const points = _.map(lines, l => l.split(','))
            const dicts = _.map(points, p => {
                return {
                    x: parseFloat(p[0]),
                    y: parseFloat(p[1])
                } as DataPoint
            })
            this.test.points = _.sortBy(dicts, ['x'])
            this.plotPoints()
        }
    }

    plotPoints(): void {
        if ($('#free-graph').length === 0) {
            return
        }

        if (this.chart != null) {
            this.chart.setPoints(this.test.points)
        } else {
            this.chart = this.service.createChart('free-graph', [], ['red'], this.test.points)
        }
    }

    updateInputs(): void {
        this.test.inputs = _.map(_.filter(this.inputs, i => i[1]), i => i[0])
    }
}
