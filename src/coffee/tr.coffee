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
            'Connect': 'Connect'
            'Hardware Configuration': 'Hardware Configuration'
            'Signal Generation': 'Signal Generation'
            'Control Model': 'Control Model'
            'Address': 'Address'
            'Connected with:': 'Connected with:'
            'Disconnect': 'Disconnect'
            'Shutdown server': 'Shutdown server'
            'New password': 'New password'
            'Confirm new password': 'Confirm new password'
            'Change password': 'Change password'
            'pswd-confirm-dont-match': 'Password and confirmation do not match'
            'Connection refused': 'Connection refused'
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
            'Connect': 'Connecter'
            'Hardware Configuration': 'Configuration Matérielle'
            'Signal Generation': 'Génération de Signaux'
            'Control Model': 'Modèle de Contrôle'
            'Address': 'Adresse'
            'Connected with:': 'Connecté avec:'
            'Disconnect': 'Deconnecter'
            'Shutdown server': 'Éteindre serveur'
            'New password': 'Nouveau mot de passe'
            'Confirm new password': 'Confirmer le nouveau mot de passe'
            'Change password': 'Changer le mot de passe'
            'pswd-confirm-dont-match': "Le mot de passe et sa confirmation n'égalent pas"
            'Connection refused': 'Connexion refusé'
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
            'Connect': 'Conectar'
            'Hardware Configuration': 'Configuração de Hardware'
            'Signal Generation': 'Geração de Sinal'
            'Control Model': 'Modelo de Controle'
            'Address': 'Endereço'
            'Connected with:': 'Conectado com:'
            'Disconnect': 'Desconectar'
            'Shutdown server': 'Desligar servidor'
            'New password': 'Nova senha'
            'Confirm new password': 'Confirmar nova senha'
            'Change password': 'Alterar senha'
            'pswd-confirm-dont-match': 'A senha e sua confirmação não são iguais'
            'Connection refused': 'Conexão recusada'
        de:
            'About': 'Über'
            'Language': 'Sprache'
            'English': 'Englisch'
            'French': 'Französisch'
            'Portuguese': 'Portuguisisch'
            'German': 'Deutsch'
            'Password': 'Passwort'
            'Cancel': 'Abbrechen'
            'Open': 'Öffnen'
            'Create': 'Erzeugen'
            'Error': 'Fehler'
            'Remove': 'Löschen'
            'Connect': 'Verbinden'
            'Hardware Configuration': 'Hardware Einstellung'
            'Signal Generation': 'Signal Generieren'
            'Control Model': 'Steuerungsmodell'
            'Address': 'Adresse'
            'Connected with:': 'Verbunden mit:'
            'Disconnect': 'Verbindung trennen'
            'Shutdown server': 'Server ausschalten'
            'New password': 'Neues Passwort'
            'Confirm new password': 'Neues Passwort Bestätigung'
            'Change password': 'Passwort speichern'
            'pswd-confirm-dont-match': 'Das Passwort und seine Bestätigung sind nicht gleich'
            'Connection refused': 'Verbindung abgelehnt'

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
