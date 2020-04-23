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

import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import { TestData } from '../live-graph.service';
import { ModelSimulationService } from '../model-simulation.service';
import { TranslateService } from '../translation/translation.service';

interface Graph {
  id: string;
  variables: string[];
}

@Component({
  selector: 'lachesis-model-simulation',
  templateUrl: './model-simulation.component.html',
  styleUrls: ['./model-simulation.component.scss']
})
export class ModelSimulationComponent {
  model = '([[0.5]], [[1]], [[1]], [[0]], 1)';
  x0 = '[[0]]';
  u = '1';
  ts = '40';
  buttonEnabled = true;

  variables: string[];
  graphs: Graph[] = [];
  counter = 0;
  testData: TestData[];
  error = '';

  constructor(
    private i18n: TranslateService,
    private toast: MatSnackBar,
    private service: ModelSimulationService
  ) {
  }

  simulate() {
    this.buttonEnabled = false;
    const graphs = this.graphs;
    this.graphs = [];

    const simData = {
      model: this.model,
      x0: this.x0,
      u: this.u,
      duration: this.ts
    };

    this.service.runSimulation(simData).subscribe(data => {
      this.buttonEnabled = true;

      if ('error' in data) {
        this.graphs = graphs;
        this.error = data.error;
        return;
      }

      this.error = null;

      this.graphs = graphs;
      this.variables = _.filter(_.keys(data), k => k !== 't');
      this.testData = _.map(this.variables, k => {
        return {
          sensor: k,
          points: _.map(_.zip(data['t'], data[k]) as [number, number][], o => {
            return {
              x: o[0],
              y: o[1]
            };
          })
        };
      });
    }, () => {
      this.graphs = graphs;
      const stdError = this.httpError();
      stdError();
    });
  }

  httpError(): () => void {
    return () => {
      this.buttonEnabled = true;
      const str = 'Error when connecting. Check address and try again.';
      const message = this.i18n.instant(str);
      this.toast.open(message, null, { duration: 2000 });
    };
  }

  addGraph() {
    this.graphs = _.concat(this.graphs, [{
      id: `g${this.counter++}`,
      variables: []
    }]);
  }

  addAllGraph() {
    this.graphs = _.map(this.variables, v => {
      return {
        id: `g${this.counter++}`,
        variables: [v]
      };
    });
  }

  removeAll() {
    this.graphs = [];
  }

  removeGraph(id: string) {
    this.graphs = _.filter(this.graphs, i => i.id !== id);
  }

  selectAll(graph: Graph) {
    graph.variables = this.variables;
  }

  deselectAll(graph: Graph) {
    graph.variables = [];
  }

  filterTestData(variables: string[]) {
    return _.filter(this.testData, d => _.includes(variables, d.sensor));
  }
}
