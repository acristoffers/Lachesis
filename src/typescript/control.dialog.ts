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
import { Component, OnInit } from '@angular/core'
import { MdDialogRef } from '@angular/material'
import { ControlComponent, Controller } from './control.component'
import { HardwareService, PortConfiguration, Types } from './hardware.service'

@Component({
  selector: 'control-dialog',
  templateUrl: '../html/control-dialog.htm'
})
export class ControlDialog {
  controller: Controller
  inputs: [string, boolean][]

  multilineTooltip = 'multiline\ntooltip'

  constructor(
    public dialogRef: MdDialogRef<ControlComponent>,
    private hardware: HardwareService
  ) {
    this.hardware.getConfiguration().subscribe(([driver, ports, calibration, locks]) => {
      const isInput = (p: PortConfiguration) => (p.type & Types.Input) > 0

      this.inputs = _.map(_.filter(ports, isInput), p => [p.alias, false] as [string, boolean])
      const cs = _.map(calibration, c => [c.alias, _.filter(ports, p => p.id === c.port)[0]] as [string, PortConfiguration])
      this.inputs = _.concat(this.inputs, _.map(_.filter(cs, c => isInput(c[1])), c => [c[0], false] as [string, boolean]))
      this.inputs = _.map(this.inputs, i => [i[0], _.includes(this.controller.inputs, i[0])] as [string, boolean])
    })
  }

  save(): void {
    this.dialogRef.close(this.controller)
  }

  cancel(): void {
    this.dialogRef.close(null)
  }

  updateInputs(): void {
    this.controller.inputs = _.map(_.filter(this.inputs, i => i[1]), i => i[0])
  }
}
