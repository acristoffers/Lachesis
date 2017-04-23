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

import { Injectable } from '@angular/core'
import { SharedData } from './shared_data.service'
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs'

interface SetupArgument {
    name: string,
    default_value?: string
}

interface Port {
    id: number
    name: string
    analog: {
        input: boolean,
        output: boolean,
        read_range: [number, number]
        write_range: [number, number]
    }
    digital: {
        input: boolean,
        output: boolean,
        pwm: boolean
    }
}

export interface PortConfiguration {
    id?: number
    name?: string | number
    alias?: string
    type?: number
    defaultValue?: any
}

export interface Driver {
    name: string,
    has_setup: boolean,
    ports: Port[]
    setup_arguments: SetupArgument[]
}

@Injectable()
export class HardwareService {
    constructor(
        private http: Http,
        private sharedData: SharedData
    ) {
    }

    private doGet(url: string): Observable<any> {
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SharedData.accessToken}`
        })
        const options = new RequestOptions({ headers: headers });
        const observable = this.http.get(url, options)
        return observable.map((res: Response) => res.json())
    }

    private doPost(url: string, data: any): Observable<Response> {
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SharedData.accessToken}`
        })
        const options = new RequestOptions({ headers: headers });
        const observable = this.http.post(url, data, options)
        return observable.map((res: Response) => res.json())
    }

    listDrivers(): Observable<Driver[]> {
        const path = 'hardware/drivers'
        const url = `${SharedData.scheme}://${SharedData.moiraiAddress}/${path}`
        return this.doGet(url)
    }

    setConfiguration(driver: Driver, ports: PortConfiguration[]): Observable<void> {
        const path = 'hardware/configuration'
        const url = `${SharedData.scheme}://${SharedData.moiraiAddress}/${path}`
        const data: any = driver
        data.ports = ports
        return this.doPost(url, data).map(response => null)
    }

    getConfiguration(): Observable<[Driver, PortConfiguration[]]> {
        const path = 'hardware/configuration'
        const url = `${SharedData.scheme}://${SharedData.moiraiAddress}/${path}`
        return this.doGet(url).map(res => {
            res = res || { ports: [] }
            const driver: Driver = res
            const ports: PortConfiguration[] = driver.ports
            driver.ports = []
            return [driver, ports]
        })
    }
}
