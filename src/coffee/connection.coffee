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

if process?
   process.on 'uncaughtException', (err) ->
       if ~err.toString().indexOf('ECONNREFUSED') # if err contains ECONNREFUSED
           toast t 'Connection refused'
           Connection.disconnect()

net = null

Connection =
    is_connected: false
    _client: null
    _data: ''
    connect_to_server: (address, password) ->
        console.log "Connecting to #{address}"
        try
            if net?
                Connection._client = new net.Socket()
                Connection._client.connect 5000, address, ->
                    Connection.authenticate password
                Connection._client.on 'data', Connection.data_received
                Connection._client.on 'close', ->
                    Connection.disconnect() if Connection.is_connected
            else
                Connection._client = new WebSocket "ws://#{address}:5001", 'binary'
                Connection._client.onclose = ->
                    Connection.disconnect() if Connection.is_connected
                Connection._client.onmessage = (event) ->
                    fr = new FileReader()
                    fr.readAsText(event.data)
                    fr.onload = (event) ->
                        data = fr.result
                        Connection.data_received data
                Connection._client.onopen = ->
                    Connection.authenticate password
        catch e
            toast e

    disconnect: ->
        if net?
            Connection._client.destroy()
        else
            Connection._client.close()
        Connection._client = null
        Connection.is_connected = false
        Connection.hide_loading()
        Connection.show_form()
        toast t 'Disconnected'

    SHA512: (str) ->
        buffer = new TextEncoder("utf-8").encode str
        window.crypto.subtle.digest("SHA-512", buffer).then( (hash) ->
            hash = new Uint8Array(hash)
            hash = (('00' + byte.toString(16)).slice( - 2) for byte in hash)
            hash = hash.join ''
            return hash
        )

    authenticate: (password) ->
        Connection.after_gensalt = (salt) ->
            if password.length == 0
                Connection.send 'AUTH'
            else
                Connection.SHA512(password).then( (hash) ->
                    Connection.SHA512(hash + salt).then( (hash2) ->
                        Connection.send "AUTH #{btoa hash2}"
                    )
                )
        Connection.send 'GENSALT'

    # Intendend for any preprocess routine, like cryptography
    preprocess_in: (data) ->
        return data.trim()

    preprocess_out: (data) ->
        data = "#{data};"
        return data

    data_received: (data) ->
        data = data.toString() unless typeof(data) == 'string'
        data = Connection.preprocess_in data
        data = Connection._data + data
        if ~data.indexOf(';') # if data contains ';'
            [ds..., Connection._data] = data.split ";"
            for data in ds
                data = data.trim()
                continue if data == 'ALIVE'
                [cmd, args...] = data.split ' '
                args = (atob arg for arg in args)
                if cmd == 'AUTH'
                    Connection.hide_loading()
                    if args.first() == 'OK'
                        Connection.is_connected = true
                        $('#conn-address-span').html $('#conn-address').val()
                        Connection.show_info()
                    else
                        Connection.disconnect()
                else if cmd == 'GENSALT'
                    salt = args.first()
                    Connection.after_gensalt(salt)
                else if cmd == 'CHANGEPSWD'
                    if args.first() == 'OK'
                        toast t 'Password changed'

    send: (data) ->
        data = Connection.preprocess_out data
        if net?
            Connection._client.write(data)
        else
            Connection._client.send(data)

    show_form: ->
        $('#connect-form').removeAttr 'unresolved'
        $('#connected-pane').attr 'unresolved', true
        $('#conn-password').parent().get(0).MaterialTextfield.change ''
        $('#connect').click()

    show_info: ->
        $('#connected-pane').removeAttr 'unresolved'
        $('#connect-form').attr 'unresolved', true
        $('#new-pswd').parent().get(0).MaterialTextfield.change ''
        $('#confirm-new-pswd').parent().get(0).MaterialTextfield.change ''

    show_loading: ->
        $('#conn-loading').addClass 'is-active'

    hide_loading: ->
        $('#conn-loading').removeClass 'is-active'

    init: ->
        try
            net = require 'net'
        catch e
            null

        # Connects to a Moirai server
        $('#conn-connect').click ->
            Connection.show_loading()
            address = $('#conn-address').val()
            password = $('#conn-password').val()
            Connection.connect_to_server address, password
            false

        $('#conn-disconnect').click ->
            Connection.disconnect()

        $('#conn-shutdown').click ->
            Connection.send 'QUIT;'
            Connection.disconnect()

        $('#conn-change-pswd').click ->
            npswd = $('#new-pswd').val()
            cnpswd = $('#confirm-new-pswd').val()
            if npswd != cnpswd
                toast t 'pswd-confirm-dont-match'
            else
                Connection.SHA512(npswd).then( (hash) ->
                    Connection.send "CHANGEPSWD #{btoa hash}"
                    Connection.disconnect()
                )
