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

get_locale = ->
    locale = window.navigator.userLanguage || window.navigator.language
    locale = locale.split('-')[0]
    return locale if locale in ['en', 'de', 'fr', 'pt']
    'en'

class I18N
    @tr:
        en:
            'About': 'About'
            'Language': 'Language'
            'English': 'English'
            'French': 'French'
            'Portuguese': 'Portuguese'
            'German': 'German'
            'Password': 'Password'
            'Cancel': 'Cancel'
            'Open': 'Open'
            'Create': 'Create'
            'Error': 'Error'
            'Remove': 'Remove'
        fr:
            'About': 'À propos'
            'Language': 'Langue'
            'English': 'Anglais'
            'French': 'Français'
            'Portuguese': 'Portugais'
            'German': 'Allemand'
            'Password': 'Mot de passe'
            'Cancel': 'Annuler'
            'Open': 'Ouvrir'
            'Create': 'Créer'
            'Error': 'Erreur'
            'Remove': 'Supprimer'
        pt:
            'About': 'Sobre'
            'Language': 'Idioma'
            'English': 'Inglês'
            'French': 'Francês'
            'Portuguese': 'Português'
            'German': 'Alemão'
            'Password': 'Senha'
            'Cancel': 'Cancelar'
            'Open': 'Abrir'
            'Create': 'Criar'
            'Error': 'Erro'
            'Remove': 'Remover'
        de:
            'About': 'Über'
            'Language': 'Sprache'
            'English': 'Englicsh'
            'French': 'Französisch'
            'Portuguese': 'Portuguisisch'
            'German': 'Deutsch'
            'Password': 'Passwort'
            'Cancel': 'Abbrechen'
            'Open': 'Öffnen'
            'Create': 'Erzeugen'
            'Error': 'Fehler'
            'Remove': 'Löschen'

    @locale = get_locale()

    @t: (str) ->
        I18N.tr[I18N.locale][str]

    @update_translation: ->
        attr_pattern = /data-([a-zA-Z0-9-_]+)-tr/
        $('html').attr 'lang', I18N.locale
        $('*').each ->
            node = $(this)
            node.html I18N.t node.attr 'data-tr' if node.attr('data-tr')?
            $.each this.attributes, ->
                if this.name.match attr_pattern
                    name = this.name.match(attr_pattern)[1]
                    value = node.attr this.name
                    node.attr name, I18N.t value

window.i18n = I18N
window.t = window.i18n.t
