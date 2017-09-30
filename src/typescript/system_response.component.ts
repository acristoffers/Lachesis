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
import { MdSnackBar, MdDialog } from '@angular/material'
import { Router } from '@angular/router'
import { TranslateService } from './translation/translation.service'
import { SystemResponseService, ResponseTest } from './system_response.service'
import { HardwareService } from './hardware.service'
import { SystemResponseDialog } from './system_response.dialog'

@Component({
    selector: 'system-response',
    templateUrl: '../html/system_response.htm'
})
export class SystemResponseComponent implements OnInit {
    tests: ResponseTest[] = []

    constructor(
        private toast: MdSnackBar,
        private i18n: TranslateService,
        private sr: SystemResponseService,
        private hardware: HardwareService,
        private dialog: MdDialog,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadTests()
    }

    loadTests(): void {
        this.sr.loadTests().subscribe(tests => {
            this.tests = _.sortBy(tests, ['name', 'id'])
        }, this.httpError())
    }

    saveTests(): void {
        this.sr.saveTests(this.tests).subscribe(() => this.loadTests())
    }

    runTest(test: ResponseTest): void {
        this.sr.runTest(test).subscribe(() => {
            this.router.navigate(['live-graph'])
        })
    }

    editTest(test: ResponseTest): void {
        const dialogRef = this.dialog.open(SystemResponseDialog)
        dialogRef.updateSize('70%', '90%')
        dialogRef.componentInstance.test = $.extend({}, test)
        dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
                this.tests = this.tests.filter(t => t.id !== test.id)
                result.id = test.id
                this.tests.push(result)
                this.saveTests()
            }
        })
    }

    removeTest(test: ResponseTest): void {
        this.tests = this.tests.filter(t => t.id !== test.id)
        this.saveTests()
    }

    addTest(): void {
        const dialogRef = this.dialog.open(SystemResponseDialog)
        dialogRef.updateSize('70%', '90%')
        dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
                result.id = (_.max(_.map(this.tests, t => t.id)) || 0) + 1
                this.tests.push(result)
                this.saveTests()
            }
        })
    }

    httpError(): () => void {
        return () => {
            const str = 'Error when connecting. Check address and try again.'
            const message = this.i18n.instant(str)
            this.toast.open(message, null, { duration: 2000 })
        }
    }

    presentType(type: string): string {
        return _.join(_.map(_.split(type, '-'), s => s[0].toUpperCase() + s.substring(1)), ' ')
    }
}
