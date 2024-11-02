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

import * as _ from 'lodash';
import { Injectable, Inject } from '@angular/core';
import { TRANSLATIONS } from './translation';

@Injectable()
export class TranslateService {
  private _currentLang: string = "en";

  public get currentLang(): string {
    return this._currentLang;
  }

  constructor(@Inject(TRANSLATIONS) private _translations: any) {
  }

  public use(lang: string): void {
    if (lang == null) {
      lang = "en";
    }
    this._currentLang = lang;
    localStorage.setItem('language', lang);
  }

  private translate(key: string): string {
    const lang = this._translations.get(this.currentLang) || {};
    return lang[key] || key;
  }

  public instant(key: string): string {
    return this.translate(key);
  }
}
