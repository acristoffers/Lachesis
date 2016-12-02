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

HardwareTCPProcessor =
    hw_list_drivers: (args) ->
        elements = (create_driver_radio(arg) for arg in args)
        $('#hw-drivers').html elements.join ''
        update_mdl_components()
        $('input[type=radio][name=hw-driver]').change ->
            driver = $('input[type=radio][name=hw-driver]:checked').val()
            Connection.send_cmd 'HW_DRIVER_NAME_SET', [driver]
            Connection.send_cmd 'HW_DRIVER_HAS_SETUP', [driver]
        Connection.send_cmd 'HW_DRIVER_NAME_GET', []

    hw_driver_name_get: (args) ->
        name = args.first()
        if name.length > 0
            digest = (str) -> btoa(str).replace(/[=+/]/g, '')
            $("#hw-driver-#{digest name}").click()

    hw_driver_has_setup: (args) ->
        $('#hw-driver-setup-args').html loading_tag
        $('#hw-driver-setup').removeAttr 'unresolved'
        update_mdl_components()
        has_setup = JSON.parse args
        if has_setup
            driver = $('input[type=radio][name=hw-driver]:checked').val()
            Connection.send_cmd 'HW_DRIVER_SETUP_ARGS', [driver]
        else
            $('#hw-driver-setup').attr 'unresolved', true
        $('#hw-driver-pinmap').attr 'unresolved', true

    hw_driver_setup_args: (args) ->
        args = (JSON.parse(arg) for arg in args)
        fields = ''
        Hardware.setup_arguments = []
        for arg in args
            if typeof(arg) == 'string'
                arg_name = arg
                Hardware.setup_arguments.push arg_name
                fields += '<br>' + create_textfield arg_name, ''
            else
                arg_name = arg.first()
                Hardware.setup_arguments.push arg_name
                fields += '<br>' + create_textfield arg_name, arg.last()
        $('#hw-driver-setup-args').html fields
        update_mdl_components()
        id = (str) -> "#hw-setup-arg-#{str}"
        for arg in Hardware.setup_arguments
            $(id arg).change ->
                data = ([a, $(id a).val() ] for a in Hardware.setup_arguments)
                data = JSON.stringify data
                Connection.send_cmd 'HW_DRIVER_SETUP_ARGS_VALUES_SET', [data]
        $('#hw-driver-setup').removeAttr 'unresolved'
        Connection.send_cmd 'HW_DRIVER_SETUP_ARGS_VALUES_GET', []

    hw_driver_setup_args_values_get: (args) ->
        kvs = JSON.parse args.first()
        keys = (key for [key, value] in kvs)
        return if keys.length != Hardware.setup_arguments.length
        return if $(keys).not(Hardware.setup_arguments).length
        return if $(Hardware.setup_arguments).not(keys).length
        id = (str) -> "#hw-setup-arg-#{str}"
        $(id key).parent().get(0).MaterialTextfield.change value for [key, value] in kvs

    hw_driver_connect: (args) ->
        if args[0] == 'OK'
            Connection.send_cmd 'HW_DRIVER_LIST_PORTS', []
        else
            $('#hw-setup-pinmap').attr 'unresolved', true
            toast t 'Failed'

    hw_driver_list_ports: (ports) ->
        Hardware.ports = (JSON.parse(port) for port in ports)
        $('#hw-setup-pinmap').removeAttr 'unresolved'

    hw_driver_is_connected: (status) ->
        status = JSON.parse(status)
        console.log status
        if status
            console.log 'listing_ports'
            Connection.send 'HW_DRIVER_LIST_PORTS'

loading_tag = '<div class="mdl-spinner mdl-js-spinner is-active"></div>'

create_textfield = (name, value) ->
    input = "<input class=\"mdl-textfield__input\" type=\"text\" id=\"hw-setup-arg-#{name}\" data-arg=\"#{name}\" value=\"#{value}\">"
    label = "<label class=\"mdl-textfield__label\" for=\"hw-setup-arg-#{name}\">#{name}</label>"
    div = "<div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">#{input}#{label}</div>"
    return div

create_driver_radio = (driver) ->
    digest = (str) -> btoa(str).replace(/[=+/]/g, '')
    input = "<input type=\"radio\" id=\"hw-driver-#{digest driver}\" class=\"mdl-radio__button\" name=\"hw-driver\" value=\"#{driver}\">"
    span = "<span class=\"mdl-radio__label\">#{driver}</span>"
    label = "<label class=\"mdl-radio mdl-js-radio\" for=\"hw-driver-#{digest driver}\">#{input}#{span}</label>"
    div = "<div class=\"hw-driver\">#{label}</div>"
    return div

create_html_element = (str) ->
    div = document.createElement 'div'
    div.innerHTML = str
    div.firstChild

generate_random_bytes = (size) ->
    bytes = new Uint8Array(size)
    window.crypto.getRandomValues bytes
    to_hex = (e) -> String("00#{Number(e).toString(16).toUpperCase()}")[ - 2..]
    bytes = Array.prototype.map.call bytes, to_hex
    bytes.join ''

enforce_port_integrity = (row) ->
    row = $(row)
    row.find('.hw-port-id').html row.index()
    return unless Hardware.ports.length
    port = $(row.find('.hw-port-name'))
    alias = row.find('.hw-port-alias').get(0).MaterialTextfield
    digana =
        objs: $(row.find('.hw-port-digana input'))
        value: -> row.find('.hw-port-digana input:checked').val()
        check: (value = 1) -> $(row.find(".hw-port-digana input[value=#{value}]")).parent().get(0).MaterialRadio.check()
    inout =
        objs: $(row.find('.hw-port-inout input'))
        value: -> row.find('.hw-port-inout input:checked').val()
        check: (value = 1) -> $(row.find(".hw-port-inout input[value=#{value}]")).parent().get(0).MaterialRadio.check()
    pwm =
        obj: row.find('.hw-port-pwm input')
        value: -> row.find('.hw-port-pwm input').get(0).checked
        on: ->
            $(row.find(".hw-port-pwm")).get(0).MaterialSwitch.on()
            inout.check(0)
        off: -> $(row.find(".hw-port-pwm")).get(0).MaterialSwitch.off()
    value =
        obj: row.find('.hw-port-value input')
        text: (val) ->
            if val?
                row.find('.hw-port-value').get(0).MaterialTextfield.change val
            else
                return row.find('.hw-port-value input').val()
    remove_btn = row.find('.hw-port-remove')
    obj_for_port = (port_id) ->
        (p for p in Hardware.ports when port_id.toString() == p['id'].toString()).first()
    port_obj = obj_for_port port.val()
    used_ids = ($(p).val() for p in $('#hw-setup-pinmap tbody select.hw-port-name') when $(port).val() != $(p).val())
    port.find('option').removeAttr 'disabled'
    $(port.find("option[value=#{id}]")).attr('disabled', true) for id in used_ids
    is_digital = port_obj['digital']['input'] or port_obj['digital']['output']
    is_analog = port_obj['analog']['input'] or port_obj['analog']['output']
    if is_digital and is_analog
        digana.objs.removeAttr 'disabled'
        digana.check(digana.value())
    else if is_digital
        digana.objs.attr 'disabled', true
        digana.check(1)
    else
        digana.objs.attr 'disabled', true
        digana.check(0)
    type = if digana.value() == '1' then 'digital' else 'analog'
    is_input = port_obj[type]['input']
    is_output = port_obj[type]['output']
    if is_input and is_output
        inout.objs.removeAttr 'disabled'
        inout.check(inout.value())
    else if is_input
        inout.objs.attr 'disabled', true
        inout.check(1)
    else
        inout.objs.attr 'disabled', true
        inout.check(0)
    if inout.value() == '1'
        value.obj.attr 'disabled', true
        value.text ''
        pwm.off()
    else
        value.obj.removeAttr 'disabled'
    is_pwm = port_obj['digital']['pwm']
    if is_pwm
        pwm.obj.removeAttr 'disabled'
        if pwm.value() then pwm.on() else pwm.off()
    else
        pwm.obj.attr 'disabled', true
        pwm.off()
    pwm.obj.click ->
        if this.checked
            inout.check(0)
            value.obj.removeAttr 'disabled'
    inout.objs.change ->
        enforce_port_integrity(row)
    remove_btn.click ->
        row.remove()
        enforce_port_integrity(r) for r in $('#hw-setup-pinmap tbody tr')
    $(port).change ->
        enforce_port_integrity(r) for r in $('#hw-setup-pinmap tbody tr')

hw_add_port = ->
    # Functions to create the needed HTML elements
    ports_select = () ->
        ports = ([port['id'], port['name']] for port in Hardware.ports)
        options = ("<option value=\"#{port[0]}\">#{port[1]}</option>" for port in ports)
        create_html_element "<select class=\"hw-port-name\">#{options.join ''}</select>"
    create_input = (name) ->
        random_id = generate_random_bytes 2
        label = "<label class=\"mdl-textfield__label\" for=\"#{random_id}\"></label>"
        input = "<input id=\"#{random_id}\" type=\"text\" class=\"mdl-textfield__input\">"
        div = "<div class=\"hw-port-#{name} mdl-textfield mdl-js-textfield\">#{input}#{label}</div>"
        create_html_element div
    create_radio = (ename, values, separator = '') ->
        random_id = generate_random_bytes 2
        divs = []
        i = 0
        for [name, value] in values
            i = i + 1
            input = "<input type=\"radio\" id=\"#{i}-#{random_id}\" class=\"mdl-radio__button\" name=\"#{random_id}\" value=\"#{value}\">"
            span = "<span class=\"mdl-radio__label\" data-tr=\"#{name}\"></span>"
            label = "<label class=\"hw-port-#{ename} mdl-radio mdl-js-radio\" for=\"#{i}-#{random_id}\">#{input}#{span}</label>"
            divs.push "<div data-name=\"#{random_id}\">#{label}</div>"
        divs = divs.join separator
        create_html_element "<div>#{divs}</div>"
    create_checkbox = (ename) ->
        random_id = generate_random_bytes 2
        input = "<input type=\"checkbox\" id=\"#{ename}-#{random_id}\" class=\"mdl-switch__input\">"
        span = "<span class=\"mdl-switch__label\"></span>"
        label = "<label class=\"hw-port-#{ename} mdl-switch mdl-js-switch mdl-js-ripple-effect\" for=\"#{ename}-#{random_id}\">#{input}#{span}</label>"
        create_html_element label
    create_actions = ->
        remove = "<button class=\"hw-port-remove mdl-button mdl-js-button mdl-button--raised mdl-button--accent\"><span data-tr=\"Remove\"></span></button>"
        create_html_element remove
    create_col = (element) ->
        col = document.createElement 'td'
        col.appendChild element
        col
    # Makes a list of already used pin IDs
    used_ids = ($(p).val() for p in $('#hw-setup-pinmap tbody select.hw-port-name'))
    # Use those functions to create the row.
    pin_name = if Hardware.ports.length then ports_select() else create_input('name')
    pin_alias = create_input 'alias'
    pin_digana = create_radio 'digana', [['Digital', 1], ['Analog', 0]]
    pin_inout = create_radio 'inout', [['Input', 1], ['Output', 0]]
    pin_pwn = create_checkbox 'pwm'
    pin_val = create_input 'value'
    pin_id = create_html_element '<span class="hw-port-id"></span>'
    actions = create_actions()
    cols = [pin_name, pin_alias, pin_digana, pin_inout, pin_pwn, pin_val, pin_id, actions]
    cols = (create_col(e) for e in cols)
    row = document.createElement 'tr'
    row.className = 'hw-port-row'
    row.appendChild(col) for col in cols
    $('#hw-setup-pinmap table tbody').append row
    update_mdl_components()
    i18n.update_translation()
    # Change select to the first not used ID
    for id in used_ids
        $($(pin_name).find("option[value=#{id}]")).attr 'disabled', true
    $(pin_name).val($(pin_name).find('option:enabled:first').val())
    enforce_port_integrity(row) for row in $('#hw-setup-pinmap tbody tr')

hw_values_from_row = (row) ->
    row = $(row)
    values =
        id: parseFloat(row.find('.hw-port-name').val())
        alias: row.find('.hw-port-alias input').val()
        digital: row.find('.hw-port-digana input:checked').val() == '1'
        input: row.find('.hw-port-inout input:checked').val() == '1'
        pwm: row.find('.hw-port-pwm input').get(0).checked
        value: parseFloat(row.find('.hw-port-value input').val()) || 0
        map: parseInt(row.index())

hw_save = ->
    rows = $('#hw-setup-pinmap table tbody tr')
    rows = (hw_values_from_row(row) for row in rows)
    rows = (JSON.stringify(row) for row in rows)
    Connection.send_cmd 'HW_PORT_MAPPING_SET', rows

window.Hardware =
    ports: []

    init: ->
        Connection._tcp_listeners.push HardwareTCPProcessor
        $('#hw-save').click hw_save
        $('#hw-add-port').click hw_add_port
        $('#hw-setup').click -> Connection.send 'HW_DRIVER_CONNECT'

    activated: ->
        Connection.send 'HW_LIST_DRIVERS'
        Connection.send 'HW_DRIVER_IS_CONNECTED'
