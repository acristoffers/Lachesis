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

import * as CanvasJS from 'canvasjs'

export interface DataPoint {
    x?: any
    label?: any
    y: number
}

export class Chart {
    private chart: CanvasJS.Chart

    get chartReference() {
        return this.chart
    }

    constructor(
        id: string,
        title: string,
        type: string,
        data: DataPoint[]
    ) {
        const options = {
            title: {
                text: title
            },
            zoomEnabled: true,
            zoomType: 'xy',
            animationEnabled: true,
            axisX: {
                gridThickness: 1
            },
            axisY: {
                includeZero: false
            },
            data: [
                {
                    type: type,
                    dataPoints: data
                }
            ]
        }

        this.chart = new CanvasJS.Chart(id, options)
        this.chart.render()
    }

    setPoints(data: DataPoint[], type: string = 'line') {
        this.chart.options.data = [{
            type: type,
            dataPoints: data
        }]
        this.chart.render()
    }

    addPoints(data: DataPoint[], type: string = 'line') {
        this.chart.options.data.push({
            type: type,
            dataPoints: data
        })
        this.chart.render()
    }

    appendPoints(data: DataPoint[], index: number) {
        Array.prototype.push.apply(this.chart.options.data[index].dataPoints, data)
        this.chart.render()
    }
}
