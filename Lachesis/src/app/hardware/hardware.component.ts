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

// tslint:disable:no-bitwise

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import * as _ from 'lodash';
import { flatMap, map } from 'rxjs/operators';
import { Calibration, Driver, HardwareService, Interlock, PortConfiguration, Types } from '../hardware.service';
import { TranslateService } from '../translation/translation.service';

@Component({
  selector: 'lachesis-hardware',
  templateUrl: './hardware.component.html',
  styleUrls: ['./hardware.component.scss']
})
export class HardwareComponent implements OnInit {
  public availableDrivers: Driver[] = [];
  private ports: PortConfiguration[] = [];
  private calibrations: Calibration[] = [];
  private interlocks: Interlock[] = [];
  private _selectedDriver: Driver;

  get selectedDriver(): Driver {
    return this._selectedDriver;
  }

  set selectedDriver(driver: Driver) {
    this.ports = [];
    this.calibrations = [];
    this.interlocks = [];
    this._selectedDriver = driver;
  }

  get inputAliases(): string[] {
    return this.portAliases(Types.Input);
  }

  get outputAliases(): string[] {
    return this.portAliases(Types.Output | Types.PWM);
  }

  constructor(
    private i18n: TranslateService,
    private toast: MatSnackBar,
    private hardwareService: HardwareService
  ) {
  }

  ngOnInit(): void {
    this.hardwareService.listDrivers().pipe(flatMap((drivers: Driver[]) => {
      this.availableDrivers = drivers;
      return this.hardwareService.getConfiguration();
    })).pipe(map(([driver, ports, calibrations, interlocks]) => {
      driver = driver as Driver;
      this.selectedDriver = this.findDriverByName(driver.name);
      this.selectedDriver.setup_arguments = driver.setup_arguments;
      this.ports = ports as PortConfiguration[];
      this.calibrations = calibrations as Calibration[];
      this.interlocks = interlocks as Interlock[];
    })).subscribe(() => { }, this.httpError());
  }

  httpError(): () => void {
    return () => {
      const str = 'Error when connecting. Check address and try again.';
      const message = this.i18n.instant(str);
      this.toast.open(message, null, { duration: 2000 });
    };
  }

  addPort(): void {
    this.ports.push({});
    this.redistributeIds();
  }

  removePort(port: PortConfiguration): void {
    this.ports = this.ports.filter(p => p !== port);
    this.redistributeIds();
  }

  addCalibration(): void {
    this.calibrations.push({} as Calibration);
  }

  removeCalibration(calibration: Calibration): void {
    this.calibrations = this.calibrations.filter(p => p !== calibration);
  }

  addInterlock(): void {
    this.interlocks.push({} as Interlock);
  }

  removeInterlock(interlock: Interlock): void {
    this.interlocks = this.interlocks.filter(i => i !== interlock);
  }

  portTypes(port: string): Types[] {
    if (!port) {
      return [];
    }

    const id = Number(port);
    if (id !== NaN) {
      const ps = this.selectedDriver.ports.filter(x => x.id === id);
      const p = _.first(ps);

      if (p != null) {
        const ports: Types[] = [
          p.digital.input ? Types.Digital | Types.Input : 0,
          p.digital.output ? Types.Digital | Types.Output : 0,
          p.digital.pwm ? Types.Digital | Types.PWM : 0,
          p.analog.input ? Types.Analog | Types.Input : 0,
          p.analog.output ? Types.Analog | Types.Output : 0,
        ];

        return ports.filter(e => !!e);
      }
    }

    if (this.selectedDriver.name === 'snap7') {
      return {
        D: [Types.Digital | Types.Input, Types.Digital | Types.Output],
        M: [Types.Digital | Types.Input, Types.Digital | Types.Output],
        Q: [Types.Digital | Types.Output],
        I: [Types.Digital | Types.Input]
      }[port[0].toUpperCase()] || [];
    }

    return [
      Types.Digital | Types.Input,
      Types.Digital | Types.Output,
      Types.Digital | Types.PWM,
      Types.Analog | Types.Input,
      Types.Analog | Types.Output,
    ];
  }

  portTypeName(type: Types): [string, string] {
    return [
      type & Types.Digital ? 'Digital' : 'Analog',
      type & Types.Input ? 'Input' : type & Types.Output ? 'Output' : 'PWM'
    ];
  }

  applyDriver(): void {
    const driver = _.merge({}, this.selectedDriver);
    driver.ports = [];

    let ports = this.ports;
    ports = _.uniqBy(ports, port => port.name);
    ports = _.uniqBy(ports, port => port.alias);

    const calibrations = this.calibrations;
    const interlocks = this.interlocks;

    this.hardwareService.setConfiguration(
      driver,
      ports,
      calibrations,
      interlocks).subscribe(() => {
        const str = 'Success!';
        const message = this.i18n.instant(str);
        this.toast.open(message, null, { duration: 2000 });
      }, this.httpError());
  }

  driveTracker(index: number, driver: Driver): string {
    return driver.name;
  }

  portTracker(index: number, port: PortConfiguration): number {
    return port.id;
  }

  resetDriver(): void {
    this.selectedDriver = null;
  }

  importConfiguration() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    document.body.appendChild(input);
    input.click();
    input.addEventListener('change', (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const json = event.target.result;
        const values = JSON.parse(json);

        this.selectedDriver = _.first(_.filter(this.availableDrivers, d => d.name === values.selectedDriver.name));
        this.ports = values.ports;
        this.calibrations = values.calibrations;
        this.interlocks = values.interlocks;
      };

      reader.readAsText(file);
    }, false);
    document.body.removeChild(input);
  }

  exportConfiguration() {
    const exportData = {
      'selectedDriver': this.selectedDriver,
      'ports': this.ports,
      'calibrations': this.calibrations,
      'interlocks': this.interlocks
    };
    const json = JSON.stringify(exportData);

    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', `data:text/json,${encodeURIComponent(json)}`);
    link.setAttribute('download', 'configuration.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private redistributeIds(): void {
    let count = 0;
    this.ports.map(port => {
      port.id = count++;
      return port;
    });
  }

  private findDriverByName(name: string): Driver {
    const drivers = _.filter(this.availableDrivers, d => d.name === name);
    return _.first(drivers);
  }

  private findPortById(id: number): PortConfiguration {
    return _.first(_.chain(this.ports).filter(p => p.id === id).value());
  }

  private portAliases(type: Types): string[] {
    const ps = _.chain(this.ports)
      .filter(p => (p.type & type) !== 0)
      .map(p => p.alias)
      .value();
    const cs = _.chain(this.calibrations)
      .filter(c => this.findPortById(c.port) != null)
      .filter(c => (this.findPortById(c.port).type & type) !== 0)
      .map(c => c.alias)
      .value();
    const as = _.concat(ps, cs);
    return _.uniq(as);
  }

  showSetup(): boolean {
    return !!this.selectedDriver &&
      this.selectedDriver.has_setup &&
      this.selectedDriver.setup_arguments.length > 0;
  }
}
