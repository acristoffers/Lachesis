import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AceEditorModule } from 'ng2-ace-editor';
import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { ConnectComponent } from './connect/connect.component';
import { ControlDialogComponent } from './control.dialog/control.dialog.component';
import { ControlService } from './control.service';
import { ControlComponent } from './control/control.component';
import { HardwareService } from './hardware.service';
import { HardwareComponent } from './hardware/hardware.component';
import { LiveGraphService } from './live-graph.service';
import { LiveGraphComponent } from './live-graph/live-graph.component';
import { ModelSimulationService } from './model-simulation.service';
import { ModelSimulationComponent } from './model-simulation/model-simulation.component';
import { RemoveUndefinedPipe } from './remove-undefined.pipe';
import { Router } from './router.service';
import { SharedDataService } from './shared-data.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SystemResponseDialogComponent } from './system-response.dialog/system-response.dialog.component';
import { SystemResponseFreeComponent } from './system-response.free/system-response.free.component';
import { SystemResponseImpulseComponent } from './system-response.impulse/system-response.impulse.component';
import { SystemResponseService } from './system-response.service';
import { SystemResponseStairComponent } from './system-response.stair/system-response.stair.component';
import { SystemResponseStepComponent } from './system-response.step/system-response.step.component';
import { SystemResponseWidePulseComponent } from './system-response.wide-pulse/system-response.wide-pulse.component';
import { SystemResponseComponent } from './system-response/system-response.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { TranslatePipe } from './translation/translation.pipe';
import { TRANSLATION_PROVIDERS } from './translation/translation';
import { TranslateService } from './translation/translation.service';

import {
  MatDialogModule,
  MatSidenavModule,
  MatButtonModule,
  MatSelectModule,
  MatInputModule,
  MatCardModule,
  MatTooltipModule,
  MatTabsModule,
  MatRadioModule,
  MatMenuModule,
  MatIconModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatListModule,
  MatCheckboxModule,
  MatExpansionModule
} from '@angular/material';
import { PidComponent } from './pid/pid.component';
import { FreeControlComponent } from './free-control/free-control.component';

@NgModule({
  declarations: [
    AppComponent,
    HardwareComponent,
    SystemResponseComponent,
    SystemResponseImpulseComponent,
    SystemResponseStairComponent,
    SystemResponseWidePulseComponent,
    SystemResponseStepComponent,
    SystemResponseFreeComponent,
    ChartComponent,
    LiveGraphComponent,
    ConnectComponent,
    ToolbarComponent,
    ControlComponent,
    ModelSimulationComponent,
    SidenavComponent,
    ControlDialogComponent,
    SystemResponseDialogComponent,
    TranslatePipe,
    RemoveUndefinedPipe,
    PidComponent,
    FreeControlComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    Router.module(),
    AceEditorModule,
    MatDialogModule,
    MatSidenavModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatTooltipModule,
    MatTabsModule,
    MatRadioModule,
    MatMenuModule,
    MatIconModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatListModule,
    MatCheckboxModule,
    MatExpansionModule
  ],
  entryComponents: [
    SystemResponseDialogComponent,
    ControlDialogComponent
  ],
  providers: [
    TRANSLATION_PROVIDERS,
    SharedDataService,
    TranslateService,
    HardwareService,
    SystemResponseService,
    LiveGraphService,
    ControlService,
    ModelSimulationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
