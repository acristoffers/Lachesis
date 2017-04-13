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

import { Observable } from 'rxjs'
import { Component } from '@angular/core'
import { MdSnackBar } from '@angular/material'
import { TranslateService } from './translation/translation.service'
import { HardwareService, Driver } from './hardware.service'

enum Types {
    Digital = 1,
    Analog = 2,
    Input = 4,
    Output = 8,
    PWM = 16
}

interface Port {
    id?: number
    name?: string | number
    alias?: string
    type?: number[]
    defaultValue?: any
}

@Component({
    selector: 'hardware',
    templateUrl: '../html/hardware.htm'
})
export class HardwareComponent {
    public availableDrivers: Driver[] = []
    private ports: Port[] = []
    private _selectedDriver: Driver

    get selectedDriver(): Driver {
        return this._selectedDriver
    }

    set selectedDriver(driver: Driver) {
        this.ports = []
        this._selectedDriver = driver
    }

    constructor(
        private i18n: TranslateService,
        private toast: MdSnackBar,
        private hardwareService: HardwareService
    ) {
        this.hardwareService.listDrivers().subscribe(
            this.availableDriversLoaded(),
            this.httpError()
        )
    }

    availableDriversLoaded(): (drivers: Driver[]) => void {
        return (drivers: Driver[]) => {
            this.availableDrivers = drivers
        }
    }

    httpError(): (error: Error) => void {
        return (error: Error) => {
            const str = 'Error when connecting. Check address and try again.'
            const message = this.i18n.instant(str)
            this.toast.open(message, null, { duration: 2000 })
        }
    }

    addPort(): void {
        this.ports.push({})
        this.redistributeIds()
    }

    removePort(port: Port): void {
        this.ports = this.ports.filter(p => p !== port)
        this.redistributeIds()
    }

    private redistributeIds(): void {
        let count = 0
        this.ports.map(port => {
            port.id = count++
            return port
        })
    }

    portTypes(port: string): Types[] {
        if (!port) {
            return []
        }

        const id = Number(port)
        if (id !== NaN) {
            const ps = this.selectedDriver.ports.filter(p => p.id === id)
            const p = _.first(ps)

            if (p != null) {
                const ports: Types[] = [
                    p.digital.input ? Types.Digital | Types.Input : 0,
                    p.digital.output ? Types.Digital | Types.Output : 0,
                    p.digital.pwm ? Types.Digital | Types.PWM : 0,
                    p.analog.input ? Types.Analog | Types.Input : 0,
                    p.analog.output ? Types.Analog | Types.Output : 0,
                ]

                return ports.filter(e => !!e)
            }
        }

        if (this.selectedDriver.name === 'snap7') {
            return {
                D: [Types.Digital | Types.Input, Types.Digital | Types.Output],
                M: [Types.Digital | Types.Input, Types.Digital | Types.Output],
                Q: [Types.Digital | Types.Output],
                I: [Types.Digital | Types.Input]
            }[port[0].toUpperCase()] || []
        }

        return [
            Types.Digital | Types.Input,
            Types.Digital | Types.Output,
            Types.Digital | Types.PWM,
            Types.Analog | Types.Input,
            Types.Analog | Types.Output,
        ]
    }

    portTypeName(type: Types): [string, string] {
        return [
            type & Types.Digital ? 'Digital' : 'Analog',
            type & Types.Input ? 'Input' : type & Types.Output ? 'Output' : 'PWM'
        ]
    }
}
