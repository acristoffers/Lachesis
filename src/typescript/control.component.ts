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
import { MdSnackBar, MdDialog } from '@angular/material'
import { TranslateService } from './translation/translation.service'
import { SharedData } from './shared_data.service'
import { ControlDialog } from './control.dialog'
import { ControlService } from './control.service'

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
    templateUrl: '../html/control.htm'
})
export class ControlComponent implements OnInit {
    controllers: Controller[] = []

    constructor(
        private http: Http,
        private toast: MdSnackBar,
        private i18n: TranslateService,
        private dialog: MdDialog,
        private service: ControlService
    ) {
    }

    ngOnInit(): void {
        this.service.load().subscribe(cs => this.controllers = cs)
    }

    add(): void {
        const controller: Controller = {
            id: null,
            name: '',
            tau: 0.1,
            runTime: 0,
            before: '',
            controller: '',
            after: '',
            inputs: []
        }

        const dialogRef = this.dialog.open(ControlDialog)
        dialogRef.updateSize('70%', '90%')
        dialogRef.componentInstance.controller = controller
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
        dialogRef.componentInstance.controller = controller
        dialogRef.afterClosed().subscribe(controller => {
            if (controller != null) {
                this.controllers = _.filter(this.controllers, c => c != controller)
                this.controllers = _.concat(this.controllers, controller)
                this.controllers = _.sortBy(this.controllers, 'name')
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
        this.service.run(controller).subscribe()
    }
}
