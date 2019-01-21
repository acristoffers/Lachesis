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

import Dygraph from 'dygraphs';
import * as _ from 'lodash';
import { TestData } from './live-graph.service';

export interface DataPoint {
  x?: any;
  label?: any;
  y: number;
}

export class ChartService {
  private chart: Dygraph;

  get chartReference() {
    return this.chart;
  }

  constructor(
    private id: string,
    data: TestData[]
  ) {
    const options = {
      drawPoints: true,
      valueRange: [0, 1],
      labelsDiv: `${this.id}-legend`,
      labels: ['Time', 'Point']
    };

    const dseries = [[0, 0]];

    this.chart = new Dygraph(document.getElementById(id), dseries, options);
    this.setTestData(data);
  }

  setTestData(data: TestData[]) {
    let dseries = _.map(_.zip.apply(_, _.map(data, 'points')), d => {
      return _.concat([d[0].x], _.map(d, 'y'));
    });

    if (dseries.length === 0) {
      dseries = [[0, 0]];
      data = [{ sensor: 'Point', points: [] }];
    }

    const min = _.min(_.map(dseries, d => _.min(d.slice(1))));
    const max = _.max(_.map(dseries, d => _.max(d.slice(1))));

    const options = {
      file: dseries,
      drawPoints: true,
      valueRange: [
        min - 0.1 * Math.abs(max - min),
        max + 0.1 * Math.abs(max - min)
      ],
      labels: _.concat(['Time'], _.map(data, 'sensor'))
    };

    this.chart.updateOptions(options);
  }

  setPoints(data: DataPoint[]) {
    let dseries = _.map(data, d => [d.x, d.y]);

    if (dseries.length === 0) {
      dseries = [[0, 0]];
    }

    const min = _.min(_.map(data, 'y'));
    const max = _.max(_.map(data, 'y'));

    const options = {
      file: dseries,
      drawPoints: true,
      valueRange: [
        min - 0.1 * Math.abs(max - min),
        max + 0.1 * Math.abs(max - min)
      ],
      axes: {
        y: {
          axisLabelWidth: 25
        }
      },
      labels: ['Time', 'Output']
    };

    this.chart.updateOptions(options);
  }
}
