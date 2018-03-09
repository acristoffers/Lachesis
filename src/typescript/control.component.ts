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
import { Router } from '@angular/router';

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

    remove(controller: Controller): void {
        this.controllers = _.filter(this.controllers, c => c != controller)
        this.service.save(this.controllers).subscribe(() => {
            this.service.load().subscribe(cs => this.controllers = cs)
        })
    }

    run(controller: Controller) {
        this.service.run(controller).subscribe(() => {
            this.router.navigate(['live-graph'])
        })
    }

    stop() {
        this.service.stopTest().subscribe()
    }

    private beforeText = `# To set an output:\noutputs['SystemOnOff'] = 1\n# Any output will be automatically set AFTER the code finishes running\n\ndef someLongFunction(x):\n    return x\n\n# States\ns['x0'] = 23\ns['ux'] = 48\ns['Kp'] = 0.4\ns['Ki'] = 0.3\ns['Kd'] = 0.05\ns['someLongFunction'] = someLongFunction\n# Use it to set variables that will be available in the next block/run`
    private controllerText = `# The state is kept between runs\nsomeLongFunction = s['someLongFunction']\n\n# The selected inputs are always available\nx = inputs['SomeSelectedInput']\n\nu1 = someLongFunction(x)\n\n# np and math are already imported!\nu = math.sin(u1)\n\noutputs['TheOutput'] = u\n\n# Inputs and outputs are automatically logged.\n# If you want to log something else (to generate graphs)\n# use the log dictionary.\nlog['u1'] = u1`
    private afterText = `# Use it to finish before exiting. Like shutting the power off.\noutputs['SystemOnOff'] = 0\n# state and log are not available here`
}
