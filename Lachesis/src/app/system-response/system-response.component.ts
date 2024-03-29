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

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { SystemResponseDialogComponent } from '../system-response.dialog/system-response.dialog.component';
import { ResponseTest, SystemResponseService } from '../system-response.service';
import { TranslateService } from '../translation/translation.service';

@Component({
  selector: 'lachesis-system-response',
  templateUrl: './system-response.component.html',
  styleUrls: ['./system-response.component.scss']
})
export class SystemResponseComponent implements OnInit {
  tests: ResponseTest[] = [];
  selection: ResponseTest[] = [];
  filter = '';

  constructor(
    private toast: MatSnackBar,
    private i18n: TranslateService,
    private sr: SystemResponseService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadTests();
  }

  loadTests(): void {
    this.sr.loadTests().subscribe({
      next: tests => {
        this.tests = _.sortBy(tests, ['name', 'id']);
      },
      error: this.httpError()
    });
  }

  saveTests(): void {
    this.sr.saveTests(this.tests).subscribe(() => this.loadTests());
  }

  runTest(test: ResponseTest): void {
    this.sr.runTest(test).subscribe(() => {
      this.router.navigate(['live-graph']);
    });
  }

  editTest(test: ResponseTest): void {
    const dialogRef = this.dialog.open(SystemResponseDialogComponent);
    dialogRef.updateSize('70%', '90%');
    dialogRef.componentInstance.test = $.extend({}, test);
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.tests = this.tests.filter(t => t.id !== test.id);
        result.id = test.id;
        this.tests.push(result);
        this.saveTests();
      }
    });
  }

  removeTest(test: ResponseTest): void {
    const msg = 'Are you sure that you want to delete this item?';
    const r = confirm(this.i18n.instant(msg));
    if (r) {
      this.tests = this.tests.filter(t => t.id !== test.id);
      this.saveTests();
    }
  }

  removeSelected() {
    const msg = 'Are you sure that you want to delete this item?';
    if (!confirm(this.i18n.instant(msg))) {
      return;
    }

    const selected = _.map(this.selection, 'id');
    this.tests = this.tests.filter(t => !_.includes(selected, t.id));
    this.saveTests();
  }

  removeAll(): void {
    const msg = 'Are you sure that you want to delete this item?';
    if (confirm(this.i18n.instant(msg))) {
      this.tests = [];
      this.saveTests();
    }
  }

  addTest(): void {
    const dialogRef = this.dialog.open(SystemResponseDialogComponent);
    dialogRef.updateSize('70%', '90%');
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        result.id = (_.max(_.map(this.tests, t => t.id)) || 0) + 1;
        this.tests.push(result);
        this.saveTests();
      }
    });
  }

  clone(test: ResponseTest): void {
    const newTest = _.assign({}, test, {
      id: _.reduce(this.tests, (a, b) => _.max([a, b.id]), 0) + 1,
      name: `${test.name} (Copy)`
    });
    this.tests.push(newTest);
    this.saveTests();
  }

  httpError(): () => void {
    return () => {
      const str = 'Error when connecting. Check address and try again.';
      const message = this.i18n.instant(str);
      this.toast.open(message, null, { duration: 2000 });
    };
  }

  presentType(type: string): string {
    return _.join(_.map(_.split(type, '-'), s => s[0].toUpperCase() + s.substring(1)), ' ');
  }

  stop(): void {
    this.sr.stopTest().subscribe();
  }

  selectAll() {
    const cs = _.filter(this.tests, c => _.includes(c.name.toLowerCase(), this.filter.toLowerCase()));
    this.selection = _.uniq(_.concat(this.selection, cs));
  }

  selectNone() {
    this.selection = _.filter(this.selection, c => !_.includes(c.name.toLowerCase(), this.filter.toLowerCase()));
  }
}
