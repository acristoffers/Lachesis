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

// tslint:disable:no-bitwise

import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as _ from 'lodash';
import { Observable, Subscription, timer } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { FreePostData, FreeService } from '../free.service';
import { HardwareService, PortConfiguration, Types } from '../hardware.service';
import { LiveGraphService, Test, TestData } from '../live-graph.service';
import { PortValue } from '../system-response.service';
import { TranslateService } from '../translation/translation.service';

interface Graph {
  id: string;
  variables: string[];
}

@Component({
  selector: 'lachesis-free-control',
  templateUrl: './free-control.component.html',
  styleUrls: ['./free-control.component.scss']
})
export class FreeControlComponent implements OnDestroy {
  freeTimer: Observable<number>;
  freeTimerSubscription: Subscription;
  timer: Observable<number>;
  timerSubscription: Subscription;
  lastError?: SafeHtml = null;
  data: FreePostData;
  lastDt = 0;
  inputs: string[];
  outputs: string[];
  test: Test;
  testData: TestData[];
  variables: string[];
  graphs: Graph[] = [];
  counter = 0;

  constructor(
    private freeService: FreeService,
    private hardware: HardwareService,
    private toast: MatSnackBar,
    private i18n: TranslateService,
    private lg: LiveGraphService,
    private sanitizer: DomSanitizer
  ) {
    this.data = {
      dt: 1,
      inputs: [],
      outputs: []
    };

    this.hardware.getConfiguration().subscribe(([driver, ports, calibration, locks]) => {
      const isInput = (p: PortConfiguration) => (p.type & Types.Input) > 0;
      const isOutput = (p: PortConfiguration) => (p.type & (Types.Output | Types.PWM)) > 0;

      this.inputs = _.map(_.filter(ports, isInput), 'alias');
      this.outputs = _.map(_.filter(ports, isOutput), 'alias');
      const cs = _.map(calibration, c => [c.alias, _.filter(ports, p => p.id === c.port)[0]] as [string, PortConfiguration]);
      this.inputs = _.concat(this.inputs, _.map(_.filter(cs, c => isInput(c[1])), c => c[0]));
      this.outputs = _.concat(this.outputs, _.map(_.filter(cs, c => isOutput(c[1])), c => c[0]));
    });

    this.timer = timer(1000, 1000);
    this.timerSubscription = this.timer.subscribe(() => {
      this.lg.lastError().subscribe(
        error => {
          if (error != null && error.length > 0) {
            this.lastError = this.sanitizer.bypassSecurityTrustHtml(error.replace('\n', '<br>'));
            if (this.freeTimerSubscription != null) {
              this.freeTimerSubscription.unsubscribe();
            }
          } else {
            this.lastError = null;
          }
        }, () => this.lastError = null
      );

      this.lg.listTests().subscribe(tests => {
        const ts = _.reverse(_.sortBy(_.filter(tests, t => t.name === 'Free'), t => new Date(t.date)));
        const test = _.first(ts);
        if (!_.isEqual(this.test, test)) {
          this.test = test;
          this.testData = [];
        }
      }, this.httpError());

      if (this.test != null && this.testData != null && this.testData.length > 0) {
        const testName = this.test.name;
        const testDate = this.test.date;
        const testSkip = this.testData[0].points.length * this.testData.length;
        this.lg.fetchTest(testName, testDate, testSkip).subscribe(data => {
          if (data.length > 0) {
            const sensors = _.map(data, 'sensor');
            sensors.forEach(sensor => {
              const oldPoints = _.find(this.testData, d => d.sensor === sensor).points;
              const newPoints = _.find(data, d => d.sensor === sensor).points;
              const ps = oldPoints.concat(newPoints);
              _.find(this.testData, d => d.sensor === sensor).points = ps;
            });
          }
        }, this.httpError());
      } else if (this.test != null && this.testData != null && this.testData.length === 0) {
        const testName = this.test.name;
        const testDate = this.test.date;
        this.lg.fetchTest(testName, testDate).subscribe(data => {
          this.testData = data;
          this.variables = _.map(this.testData, d => d.sensor);
        }, this.httpError());
      }
    });
  }

  run() {
    if (this.freeTimerSubscription != null) {
      this.freeTimerSubscription.unsubscribe();
    }

    this.freeTimer = timer(0, _.max([1000, this.data.dt * 1000]));
    this.freeTimerSubscription = this.freeTimer.pipe(flatMap(() => {
      if (this.data.dt !== this.lastDt) {
        this.lastDt = this.data.dt;
        this.run();
        return;
      }

      return this.freeService.run(this.data);
    })).subscribe();
  }

  addOutput() {
    this.data.outputs = _.concat(this.data.outputs, { alias: '', value: 0 });
  }

  removeOutput(output: PortValue) {
    this.data.outputs = _.filter(this.data.outputs, o => o !== output);
  }

  ngOnDestroy() {
    if (this.freeTimerSubscription != null) {
      this.freeTimerSubscription.unsubscribe();
    }

    if (this.timerSubscription != null) {
      this.timerSubscription.unsubscribe();
    }
  }

  httpError(): () => void {
    return () => {
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
