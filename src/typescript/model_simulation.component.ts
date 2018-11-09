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

import { Component } from '@angular/core'
import { MatSnackBar } from '@angular/material'
import { TranslateService } from './translation/translation.service'
import { ModelSimulationService } from './model_simulation.service'
import { TestData } from './live_graph.service'

interface Graph {
    id: string
    variables: string[]
}

@Component({
    selector: 'model_simulation',
    templateUrl: '../html/model_simulation.html'
})
export class ModelSimulationComponent {
    model: string = '([[-0.02,0.02],[0.02,-0.04]],[[331e-6],[0]],[[0,1]],[[0]])'
    x0: string = '[[0],[0]]'
    u: string = '80'
    ts: string = '100'
    buttonEnabled: boolean = true

    variables: string[]
    graphs: Graph[] = []
    counter: number = 0
    testData: TestData[]
    error: string = ''

    constructor(
        private i18n: TranslateService,
        private toast: MatSnackBar,
        private service: ModelSimulationService
    ) {
    }

    simulate() {
        this.buttonEnabled = false

        const data = {
            model: this.model,
            x0: this.x0,
            u: this.u,
            duration: this.ts
        }

        this.service.runSimulation(data).subscribe(data => {
            this.buttonEnabled = true

            if ('error' in data) {
                this.testData = []
                this.variables = []
                this.error = data.error
                this.graphs = []
                return
            }

            this.error = null

            this.variables = _.filter(_.keys(data), k => k != 't')
            this.testData = _.map(this.variables, k => {
                return {
                    sensor: k,
                    points: _.map(_.zip(data['t'], data[k]) as [number, number][], o => {
                        return {
                            x: o[0],
                            y: o[1]
                        }
                    })
                }
            })
        }, this.httpError())
    }

    httpError(): () => void {
        return () => {
            this.buttonEnabled = true
            const str = 'Error when connecting. Check address and try again.'
            const message = this.i18n.instant(str)
            this.toast.open(message, null, { duration: 2000 })
        }
    }

    addGraph() {
        this.graphs = _.concat(this.graphs, [{
            id: `g${this.counter++}`,
            variables: []
        }])
    }

    addAllGraph() {
        this.graphs = _.map(this.variables, v => {
            return {
                id: `g${this.counter++}`,
                variables: [v]
            }
        })
    }

    removeAll() {
        this.graphs = []
    }

    removeGraph(id: string) {
        this.graphs = _.filter(this.graphs, i => i.id != id)
    }

    selectAll(graph: Graph) {
        graph.variables = this.variables
    }

    deselectAll(graph: Graph) {
        graph.variables = []
    }

    filterTestData(variables: string[]) {
        return _.filter(this.testData, d => _.includes(variables, d.sensor))
    }
}