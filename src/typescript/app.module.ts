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

import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser'
import { HttpModule } from '@angular/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MaterialModule } from '@angular/material'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { TRANSLATION_PROVIDERS, TranslatePipe, TranslateService } from './translation'
import { RemoveUndefinedPipe } from './remove_undefined.pipe'

import { Router } from './router'

import { AppComponent } from './app.component'
import { ToolbarComponent } from './toolbar.component'
import { SidenavComponent } from './sidenav.component'
import { ConnectComponent } from './connect.component'
import { HardwareComponent } from './hardware.component'
import { SystemIdentificationComponent } from './system_identification.component'

import { HardwareService } from './hardware.service'
import { SystemIdentificationService } from './system_identification.service'
import { SharedData } from './shared_data.service'
import { SystemResponseComponent } from './system_response.component'
import { SystemResponseService } from './system_response.service'
import { SystemResponseDialog } from './system_response.dialog'
import { SystemResponseStepComponent } from './system_response.step.component'
import { SystemResponseFreeComponent } from './system_response.free'
import { SystemResponseStairComponent } from './system_response.stair'
import { SystemResponseImpulseComponent } from './system_response.impulse'
import { SystemResponseWidePulseComponent } from './system_response.wide_pulse'

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        NoopAnimationsModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        Router.module()
    ],
    declarations: [
        TranslatePipe,
        RemoveUndefinedPipe,
        AppComponent,
        ToolbarComponent,
        SidenavComponent,
        ConnectComponent,
        HardwareComponent,
        SystemIdentificationComponent,
        SystemResponseComponent,
        SystemResponseDialog,
        SystemResponseStepComponent,
        SystemResponseFreeComponent,
        SystemResponseStairComponent,
        SystemResponseImpulseComponent,
        SystemResponseWidePulseComponent
    ],
    providers: [
        TRANSLATION_PROVIDERS,
        SharedData,
        TranslateService,
        HardwareService,
        SystemIdentificationService,
        SystemResponseService
    ],
    entryComponents: [
        SystemResponseDialog
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
