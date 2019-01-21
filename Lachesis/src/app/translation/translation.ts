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

import { InjectionToken } from '@angular/core';

import { LANG_DE_NAME, LANG_DE_TRANS } from './de';
import { LANG_FR_NAME, LANG_FR_TRANS } from './fr';
import { LANG_PT_NAME, LANG_PT_TRANS } from './pt';

export const TRANSLATIONS = new InjectionToken('translations');

export class Dictionary {
    private dictionary = {
        [LANG_DE_NAME]: LANG_DE_TRANS,
        [LANG_FR_NAME]: LANG_FR_TRANS,
        [LANG_PT_NAME]: LANG_PT_TRANS
    };

    get(language: string) {
        return this.dictionary[language];
    }
}

export const TRANSLATION_PROVIDERS = [
    { provide: TRANSLATIONS, useClass: Dictionary },
];
