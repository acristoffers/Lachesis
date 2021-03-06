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

import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConnectComponent } from './connect/connect.component';
import { ControlComponent } from './control/control.component';
import { FreeControlComponent } from './free-control/free-control.component';
import { HardwareComponent } from './hardware/hardware.component';
import { LiveGraphComponent } from './live-graph/live-graph.component';
import { ModelSimulationComponent } from './model-simulation/model-simulation.component';
import { PidComponent } from './pid/pid.component';
import { SystemResponseComponent } from './system-response/system-response.component';

export class Router {
  static module(): ModuleWithProviders<RouterModule> {
    return RouterModule.forRoot([
      {
        path: 'index.html',
        redirectTo: 'connect'
      },
      {
        path: '',
        redirectTo: 'connect',
        pathMatch: 'full'
      },
      {
        path: 'connect',
        component: ConnectComponent
      },
      {
        path: 'hardware',
        component: HardwareComponent
      },
      {
        path: 'control',
        component: ControlComponent
      },
      {
        path: 'system-response',
        component: SystemResponseComponent
      },
      {
        path: 'live-graph',
        component: LiveGraphComponent
      },
      {
        path: 'model-simulation',
        component: ModelSimulationComponent
      },
      {
        path: 'pid',
        component: PidComponent
      },
      {
        path: 'free-control',
        component: FreeControlComponent
      }
    ]);
  }
}
