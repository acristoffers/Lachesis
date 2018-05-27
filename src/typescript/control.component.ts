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
import { Http, Response, RequestOptions, Headers } from '@angular/http'
import { MatSnackBar, MatDialog } from '@angular/material'
import { TranslateService } from './translation/translation.service'
import { SharedData } from './shared_data.service'
import { ControlDialog } from './control.dialog'
import { ControlService } from './control.service'
import { Router } from '@angular/router'

export interface Controller {
    id: number
    name: string
    tau: number
    runTime: number
    before: string
    controller: string
    after: string
    inputs: string[]
}

@Component({
    selector: 'control',
    templateUrl: '../html/control.html'
})
export class ControlComponent implements OnInit {
    controllers: Controller[] = []

    constructor(
        private http: Http,
        private toast: MatSnackBar,
        private i18n: TranslateService,
        private dialog: MatDialog,
        private service: ControlService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.service.load().subscribe(cs => this.controllers = cs)
    }

    add(): void {
        const c: Controller = {
            id: null,
            name: '',
            tau: 0.1,
            runTime: 0,
            before: this.beforeText,
            controller: this.controllerText,
            after: this.afterText,
            inputs: []
        }

        const dialogRef = this.dialog.open(ControlDialog)
        dialogRef.updateSize('70%', '90%')
        dialogRef.componentInstance.controller = c
        dialogRef.afterClosed().subscribe(controller => {
            if (controller != null) {
                controller.id = _.reduce(this.controllers, (a, b) => _.max([a, b.id]), 0) + 1
                this.controllers = _.concat(this.controllers, controller)
                this.controllers = _.sortBy(this.controllers, 'name')
                this.service.save(this.controllers).subscribe(() => {
                    this.service.load().subscribe(cs => this.controllers = cs)
                })
            }
        })
    }

    edit(controller: Controller): void {
        const dialogRef = this.dialog.open(ControlDialog)
        dialogRef.updateSize('70%', '90%')
        dialogRef.componentInstance.controller = $.extend({}, controller)
        dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
                this.controllers = _.filter(this.controllers, c => c.id != result.id)
                this.controllers.push(result)
                this.service.save(this.controllers).subscribe(() => {
                    this.service.load().subscribe(cs => this.controllers = cs)
                })
            }
        })
    }

    clone(controller: Controller): void {
        const newController = _.assign({}, controller, {
            id: _.reduce(this.controllers, (a, b) => _.max([a, b.id]), 0) + 1,
            name: `${controller.name} (Copy)`
        })
        this.controllers.push(newController)
        this.service.save(this.controllers).subscribe(() => {
            this.service.load().subscribe(cs => this.controllers = cs)
        })
    }

    remove(controller: Controller): void {
        const msg = 'Are you sure that you want to delete this item?'
        const r = confirm(this.i18n.instant(msg))
        if (r) {
            this.controllers = _.filter(this.controllers, c => c != controller)
            this.service.save(this.controllers).subscribe(() => {
                this.service.load().subscribe(cs => this.controllers = cs)
            })
        }
    }

    removeAll(): void {
        const msg = 'Are you sure that you want to delete this item?'
        if (confirm(this.i18n.instant(msg))) {
            this.service.save([]).subscribe(() => {
                this.service.load().subscribe(cs => this.controllers = cs)
            })
        }
    }

    run(controller: Controller): void {
        this.service.run(controller).subscribe(() => {
            this.router.navigate(['live-graph'])
        })
    }

    stop(): void {
        this.service.stopTest().subscribe()
    }

    private beforeText = `# Use this scope to set constants and do any startup need.\n# For example, it can be used to turn on subsystems, do heavy one-shot math, or\n# to define constants.\n\n# Some global variables are set automatically. They are:\n# inputs -- a dictionary whose keys are the inputs define above.\n# outputs = dict() -- the key is the output name, the value what should be set.\n# s = dict() -- This is a state variable. It persists across scopes and runs.\n# dt: float -- The sampling interval\n# np: np -- import numpy as np\n# math: math -- import math\n\n# To set an output, use the outputs dictionary:\noutputs['SystemOnOff'] = 1\noutputs['Pump1OnOff']  = 1\noutputs['Pump1PC']     = 100\n\n# To read an input, you must first check its checkbox above. After that it will\n# be accessible through the inputs dict.\ny = inputs['Level1CM']\n\n# Use the s dict to define constants and save values to use on next iterations.\ns['Kp'] = 1\ns['Ki'] = 2\ns['Kd'] = 3\n\n# You can also use the s dict to save functions, but be careful not to rely on\n# global variables, as they won't be available in the next scope/run. All\n# variables are lost between scopes/runs, except for s.\n\n# The timer only starts ticking AFTER this scope has finished, so you can put\n# long running logic here, like advanced controller matrix pré-multiplication.\n# Function declaration has no impact on performance, as the code is compiled\n# once and only rerun, so there's no problem in putting them in the next scope.`
    private controllerText = `# This scope will be run every dt seconds. If it runs for longer than dt\n# seconds, it will run on the next multiple of dt seconds since the start of the\n# test.\n\n# All variables from the Before section will be present here, plus:\n# t: float -- Time since the test started, in seconds.\n# log: dict() -- Will log the value for the key as if it was an output or input.\n\n# For example, let's recover the PID constants defined in Before:\nKp, Ki, Kd = s['Kp'], s['Ki'], s['Kd']\n\n# Let's calculate the error. It's the setpoint minus the reading\nerror = 1 - inputs['Level1CM']\n\n# Let's log the error. Now we get a nice live graph for it too.\nlog['error'] = error\n\n# You know how to do PID, let's just close the loop here:\noutputs['Pump1PC'] = error\n`
    private afterText = `# Use it to finish before exiting. Like shutting the power off.\noutputs['SystemOnOff'] = 0\n# state and log are not available here`
}
