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
import { MatDialogRef } from '@angular/material/dialog';
import { ResponseTest } from '../system-response.service';
import { SystemResponseComponent } from '../system-response/system-response.component';

@Component({
  selector: 'lachesis-system-response-dialog',
  templateUrl: './system-response.dialog.component.html',
  styleUrls: ['./system-response.dialog.component.scss']
})
export class SystemResponseDialogComponent implements OnInit {
  _test: ResponseTest = {
    id: 0,
    name: '',
    type: 'step',
    inputs: [],
    output: '',
    points: [],
    fixedOutputs: [],
    afterOutputs: [],
    logRate: 0.1
  };

  get test() {
    return this._test;
  }

  set test(test: ResponseTest) {
    this._selectedTabIndex = {
      'step': 0,
      'impulse': 1,
      'wide-pulse': 2,
      'stair': 3,
      'free': 4
    }[test.type];
    this._test = test;
  }

  _selectedTabIndex = 0;

  get selectedTabIndex() {
    return this._selectedTabIndex;
  }

  set selectedTabIndex(index: number) {
    this._selectedTabIndex = index;
    this.test.type = [
      'step',
      'impulse',
      'wide-pulse',
      'stair',
      'free'
    ][index];
  }

  constructor(
    public dialogRef: MatDialogRef<SystemResponseComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    return; // silences linter
  }

  save(): void {
    this.dialogRef.close(this.test);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
