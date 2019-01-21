import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';
import * as $ from 'jquery';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const basePath = location.href.replace(/[^/]*$/, '');
const baseElement = $(`<base href="${basePath}">`);
$('head').append(baseElement);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).catch(console.error);
