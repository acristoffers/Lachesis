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

import { Component } from '@angular/core';
import { SharedDataService } from '../shared-data.service';
import { NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'lachesis-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  currentRouter = 'connect';
  private bs = [
    { text: 'Hardware Setup', route: 'hardware' },
    { text: 'System Response', route: 'system-response' },
    { text: 'System Control', route: 'control' },
    { text: 'Graphs', route: 'live-graph' },
    { text: 'Model Simulation', route: 'model-simulation' },
    { text: 'Free Control', route: 'free-control' },
    { text: 'PID', route: 'pid' },
  ];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRouter = event.urlAfterRedirects.replace('/', '');
      });
  }

  isLoggedIn(): boolean {
    return SharedDataService.accessToken != null;
  }

  buttons() {
    return this.isLoggedIn() ? this.bs : [];
  }

  buttonColor(route: string): string {
    console.log(route);
    console.log(this.currentRouter);
    return route === this.currentRouter ? 'accent' : '';
  }
}
