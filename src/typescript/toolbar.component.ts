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

import { Input, Output, EventEmitter, Component } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry } from '@angular/material'
import { TranslateService } from './translation'
import * as _ from 'lodash'

@Component({
    selector: 'toolbar',
    templateUrl: '../html/toolbar.html'
})
export class ToolbarComponent {
    enFlagUrl: string = 'imgs/en.svg'
    deFlagUrl: string = 'imgs/de.svg'
    frFlagUrl: string = 'imgs/fr.svg'
    ptFlagUrl: string = 'imgs/pt.svg'

    private sidebarOpenFlag: boolean = false
    @Output() sidebarOpenChange = new EventEmitter<boolean>()
    @Input() set sidebarOpen(open: boolean) {
        this.sidebarOpenFlag = open
        this.sidebarOpenChange.emit(open)
    }
    get sidebarOpen(): boolean {
        return this.sidebarOpenFlag
    }

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private translate: TranslateService
    ) {
        this.registerImages(iconRegistry, sanitizer)
    }

    registerImages(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer): void {
        const images = {
            'app-icon': 'imgs/icon.svg',
            'en-flag': this.enFlagUrl,
            'fr-flag': this.frFlagUrl,
            'de-flag': this.deFlagUrl,
            'pt-flag': this.ptFlagUrl,
        }

        _.map(images, (url: string, key: string) => {
            const safeUrl = sanitizer.bypassSecurityTrustResourceUrl(url)
            iconRegistry.addSvgIcon(key, safeUrl)
        })
    }

    setLanguage(lang: string): void {
        $('html').attr('lang', lang)
        this.translate.use(lang)
    }

    toggleSidebar(): void {
        this.sidebarOpen = !this.sidebarOpen
    }
}
