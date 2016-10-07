###
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
###

unless Array::last?
    Array::last = -> this[this.length - 1]

unless Array::first?
    Array::first = -> this[0]

$ ->
    # Initializes Bootstrap Material
    $.material.init()

    # Verifies platform
    window.platform = 'desktop' unless window.platform?

    # Update translations in whole HTML
    window.i18n.update_translation()

    # Register language buttons to change language
    $('[data-lang]').click ->
        window.i18n.locale = $(this).attr 'data-lang'
        window.i18n.update_translation()

    # Displays body
    $('body').addClass window.platform
    $('body').removeAttr 'unresolved'
