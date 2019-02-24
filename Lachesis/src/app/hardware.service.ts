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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIBase } from './api-base';
import { SharedDataService } from './shared-data.service';

export enum Types {
  Digital = 1,
  Analog = 2,
  Input = 4,
  Output = 8,
  PWM = 16
}

interface SetupArgument {
  name: string;
  default_value?: string;
  value?: string;
}

interface Port {
  id: number;
  name: string;
  analog: {
    input: boolean,
    output: boolean,
    read_range: [number, number],
    write_range: [number, number]
  };
  digital: {
    input: boolean,
    output: boolean,
    pwm: boolean
  };
}

export interface PortConfiguration {
  id?: number;
  name?: string | number;
  alias?: string;
  type?: number;
  defaultValue?: any;
}

export interface Driver {
  name: string;
  has_setup: boolean;
  ports: Port[];
  setup_arguments: SetupArgument[];
}

export interface Calibration {
  port: number;
  alias: string;
  formula: string;
}

export interface Interlock {
  sensor: string;
  expression: string;
  actuator: string;
  actuatorValue: string;
}

@Injectable({
  providedIn: 'root'
})
export class HardwareService extends APIBase {
  constructor(
    http: HttpClient,
    sharedData: SharedDataService
  ) {
    super(http, sharedData);
  }

  listDrivers(): Observable<Driver[]> {
    const path = '/hardware/drivers';
    const url = this.urlFor(path);
    return this.doGet(url);
  }

  setConfiguration(
    driver: Driver,
    ports: PortConfiguration[],
    calibrations: Calibration[],
    interlocks: Interlock[]
  ): Observable<void> {
    const path = '/hardware/configuration';
    const url = this.urlFor(path);
    const data: any = driver;
    data.ports = ports;
    data.calibrations = calibrations;
    data.interlocks = interlocks;
    return this.doPost(url, data).pipe(map(response => null));
  }

  getConfiguration(): Observable<[Driver, PortConfiguration[], Calibration[], Interlock[]]> {
    const path = '/hardware/configuration';
    const url = this.urlFor(path);
    return this.doGet(url).pipe(map(res => {
      res = res || { ports: [] };
      const calibrations: Calibration[] = res.calibrations || [];
      delete res.calibrations;
      const ports: PortConfiguration[] = res.ports || [];
      delete res.ports;
      const interlocks: Interlock[] = res.interlocks || [];
      delete res.interlocks;
      const driver: Driver = res || {};
      return [driver, ports, calibrations, interlocks] as [Driver, PortConfiguration[], Calibration[], Interlock[]];
    }));
  }
}
