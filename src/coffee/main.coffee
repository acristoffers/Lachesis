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

# Create functions last and first in array.prototype
(Array::first = -> this[0]) unless Array::first?
(Array::last = -> this[this.length - 1]) unless Array::last?

# Eases access to cookies and make sure values are encoded correctly
cookie = (key, val) ->
    if val?
        localStorage.setItem key, encodeURIComponent val
    else
        decodeURIComponent localStorage.getItem key

# A settings api to save/load key/values pairs. Allows saving objects
settings = (key, val) ->
    if val?
        cookie key, JSON.stringify val
    else
        val = cookie key
        JSON.parse val if val?

update_mdl_components = ->
    componentHandler.upgradeAllRegistered() if componentHandler?

# Closes the Material Layout Drawer if it's open
close_drawer = ->
    if $('.mdl-layout__drawer').attr('aria-hidden') == "false"
        document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer()

window.toast = (msg) ->
    $('#toast').get(0).MaterialSnackbar.showSnackbar message: msg

# Application initialization
main = ->
    # Verifies platform
    window.platform = 'desktop' unless window.platform?

    # Verifies if we have a saved locale setting
    window.i18n.locale = settings 'locale' if settings 'locale'
    # Update translations in whole HTML
    window.i18n.update_translation()

    # Register language buttons to change language
    $('[data-lang]').click ->
        window.i18n.locale = $(this).attr 'data-lang'
        window.i18n.update_translation()
        settings 'locale', window.i18n.locale

    activate_page = (page) ->
        if page == 'hardware'
            Hardware.activated()

    # Listens to changes in the HASH part of the URL. It's the only part that
    # will change in this application and indicates which page is currently
    # active
    $(window).on 'hashchange', ->
        close_drawer()
        hash = location.hash.slice(1)
        return if hash == ''
        if Connection.is_connected || hash == 'connect'
            $('.page').hide()
            $("##{hash}").show()
            window.location.hash = ''
            activate_page hash
        else
            window.location.hash = '#connect'
            toast t 'Disconnected'

    # Disable all form submition. Shall be handled by javascript instead
    $('form').submit -> false

    Connection.init()
    Hardware.init()

    # Start with the connect page
    $('.page').hide()
    $("#connect").show()

    # Displays body
    $('body').addClass window.platform
    $('body').removeAttr 'unresolved'

    # Focus on Address field
    $('#conn-address').focus()

$ ->
    if window.platform?
        $(document).on 'deviceready', main
    else
        main()
