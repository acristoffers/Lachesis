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

/* eslint-disable no-bitwise */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { ChartService } from '../chart.service';
import { HardwareService, PortConfiguration, Types } from '../hardware.service';
import { PortValue, ResponseTest, SystemResponseService } from '../system-response.service';

@Component({
  selector: 'lachesis-system-response-step',
  templateUrl: './system-response.step.component.html',
  styleUrls: ['./system-response.step.component.scss']
})
export class SystemResponseStepComponent {
  private _test: ResponseTest;
  private chart: ChartService;

  v0 = 1;
  dv = 1;
  t0 = 1;
  t1 = 1;

  inputs: [string, boolean][];
  outputs: [string, boolean][];

  @Input()
  get test() {
    return this._test;
  }

  set test(test: ResponseTest) {
    if (typeof (test.output) === 'string') {
      test.output = [test.output];
    }

    this._test = test;
    this.plotPoints();
    this.testChange.emit(test);
  }

  @Output() testChange = new EventEmitter<ResponseTest>();

  constructor(
    private service: SystemResponseService,
    private hardware: HardwareService
  ) {
    this.hardware.getConfiguration().subscribe(([_driver, ports, calibration, _locks]) => {
      const isInput = (p: PortConfiguration) => (p.type & Types.Input) > 0;
      const isOutput = (p: PortConfiguration) => (p.type & (Types.Output | Types.PWM)) > 0;

      this.inputs = _.map(_.filter(ports, isInput), p => [p.alias, false] as [string, boolean]);
      this.outputs = _.map(_.filter(ports, isOutput), p => [p.alias, false] as [string, boolean]);
      const cs = _.map(calibration, c => [c.alias, _.filter(ports, p => p.id === c.port)[0]] as [string, PortConfiguration]);
      this.inputs = _.concat(this.inputs, _.map(_.filter(cs, c => isInput(c[1])), c => [c[0], false] as [string, boolean]));
      this.outputs = _.concat(this.outputs, _.map(_.filter(cs, c => isOutput(c[1])), c => [c[0], false] as [string, boolean]));

      this.inputs = _.map(this.inputs, i => [i[0], _.includes(this.test.inputs, i[0])] as [string, boolean]);
      this.outputs = _.map(this.outputs, i => [i[0], _.includes(this.test.output, i[0])] as [string, boolean]);
      this.plotPoints();
    });
  }

  addFixedOutput(): void {
    this.test.fixedOutputs.push({ alias: '', value: 0 });
  }

  removeFixedOutput(output: PortValue): void {
    this.test.fixedOutputs = _.filter(this.test.fixedOutputs, f => f !== output);
  }

  addAfterOutput(): void {
    this.test.afterOutputs.push({ alias: '', value: 0 });
  }

  removeAfterOutput(output: PortValue): void {
    this.test.afterOutputs = _.filter(this.test.afterOutputs, f => f !== output);
  }

  plotPoints(): void {
    if ($('#step-graph').length === 0) {
      return;
    }

    if (this.chart != null) {
      this.test.points = [
        { x: 0, y: this.v0 },
        { x: Math.abs(this.t0), y: this.v0 },
        { x: Math.abs(this.t0), y: this.v0 + this.dv },
        { x: Math.abs(this.t0) + Math.abs(this.t1), y: this.v0 + this.dv }
      ];

      this.chart.setPoints(this.test.points);
    } else {
      if (this.test.points.length === 4) {
        this.v0 = this.test.points[0].y;
        this.dv = this.test.points[2].y - this.v0;
        this.t0 = this.test.points[1].x;
        this.t1 = this.test.points[3].x - this.t0;
      } else {
        this.test.points = [
          { x: 0, y: this.v0 },
          { x: Math.abs(this.t0), y: this.v0 },
          { x: Math.abs(this.t0), y: this.v0 + this.dv },
          { x: Math.abs(this.t0) + Math.abs(this.t1), y: this.v0 + this.dv }
        ];
      }

      this.chart = this.service.createChart('step-graph', [], ['red'], this.test.points);
    }
  }

  updateInputs(): void {
    this.test.inputs = _.map(_.filter(this.inputs, i => i[1]), i => i[0]);
  }

  updateOutputs(): void {
    this.test.output = _.map(_.filter(this.outputs, i => i[1]), i => i[0]);
  }
}
