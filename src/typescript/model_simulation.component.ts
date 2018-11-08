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
import { HardwareService, Driver, PortConfiguration, Calibration, Interlock, Types } from './hardware.service'

@Component({
    selector: 'model_simulation',
    templateUrl: '../html/model_simulation.html'
})
export class ModelSimulationComponent {
    model: string = '([[-0.02,0.02],[ 0.02,-0.04]],[[331e-6],[0]],[[0,1]],[[0]])'
    x0: string = '[[0],[0]]'
    u: string = '80'
    ts: string = '100'

    constructor(
        private i18n: TranslateService,
        private toast: MatSnackBar,
        private hardwareService: HardwareService
    ) {
    }

    simulate() {
    }
}
