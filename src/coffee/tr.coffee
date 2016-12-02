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
            'Disconnected': 'Disconnected'
            'Password changed': 'Password changed'
            'Driver': 'Driver'
            'Driver setup': 'Driver setup'
            'Apply setup': 'Apply setup'
            'Pin name': 'Port name'
            'Pin alias': 'Port alias'
            'Pin mapping': 'Port mapping'
            'Pin mapping value': 'Port mapping value'
            'pin-name-tooltip': 'The name of the physical port, according to the driver.'
            'pin-alias-tooltip': 'An alias you give to the port. Like a variable name.'
            'Digital/Analog': 'Digital/Analog'
            'pin-digana-tooltip': 'Whether this port will be used as digital or analog.'
            'Input/Output': 'Input/Output'
            'pin-inout-tooltip': 'Whether this port will be used as input or output.'
            'PWM': 'PWM'
            'pin-pwm-tooltip': 'Whether this port will be used to output a PWM signal. Must be supported by hardware.'
            'Initial value': 'Initial value'
            'pin-initial-value-tooltip': 'The value this port will be set to upon initialization.'
            'Internal ID': 'Internal ID'
            'pin-internal-id-tooltip': 'ID used internally by the server.'
            'Digital': 'Digital'
            'Analog': 'Analog'
            'Input': 'Input'
            'Output': 'Output'
            'Failed': 'Failed'
            'Save': 'Save'
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
            'Disconnected': 'Déconnecté'
            'Password changed': 'Mot de passe changé'
            'Driver': 'Driver'
            'Driver setup': 'Configuration du pilote'
            'Apply setup': 'Appliquer la configuration'
            'Pin name': 'Nome du port'
            'Pin alias': 'Alias du port'
            'Pin mapping': 'Mappage du port'
            'Pin mapping value': 'Valeur de mappage du port'
            'pin-name-tooltip': 'Nome du port physique, selon le pilote.'
            'pin-alias-tooltip': 'Un alias que vous donnez au port. Comme un nome de variable.'
            'Digital/Analog': 'Numérique/Analogique'
            'pin-digana-tooltip': 'Si le port est utilisé comme numérique ou analogique.'
            'Input/Output': 'Entrée/Sortie'
            'pin-inout-tooltip': 'Indique si ce port sera utilisé comme entrée ou sortie.'
            'PWM': 'PWM'
            'pin-pwm-tooltip': 'Indique si ce port sera utilisé pour produire un signal PWM. Doit être pris en charge par le matériel.'
            'Initial value': 'Valeur initiale'
            'pin-initial-value-tooltip': 'Valeur à laquelle ce port sera réglé lors de l\'initialisation.'
            'Internal ID': 'ID interne'
            'pin-internal-id-tooltip': 'ID utilisé en interne par le serveur.'
            'Digital': 'Numérique'
            'Analog': 'Analogogique'
            'Input': 'Entrée'
            'Output': 'Sortie'
            'Failed': 'Échoué'
            'Save': 'Enregistrer'
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
            'Disconnected': 'Desconectado'
            'Password changed': 'Senha alterada'
            'Driver': 'Driver'
            'Driver setup': 'Configuração do driver'
            'Apply setup': 'Aplicar configuração'
            'Pin name': 'Nome da porta'
            'Pin alias': 'Alias da porta'
            'Pin mapping': 'mapeamento de portas'
            'Pin mapping value': 'Valor de mapeamento da porta'
            'pin-name-tooltip': 'Nome da porta físico, conforme o driver.'
            'pin-alias-tooltip': 'Um alias que você dá à porta. Como um nome de variável.'
            'Digital/Analog': 'Digital/Analógico'
            'pin-digana-tooltip': 'Se a porta será utilizada como digital ou analógica.'
            'Input/Output': 'Entrada/Saída'
            'pin-inout-tooltip': 'Se a porta será utilizada como entrada ou saída.'
            'PWM': 'PWM'
            'pin-pwm-tooltip': 'Se a porta será utilizada para gerar um sinal PWM. Deve ser suportado pelo hardware.'
            'Initial value': 'Valor inicial'
            'pin-initial-value-tooltip': 'Valor para qual a saída da porta será definida após inicialização.'
            'Internal ID': 'ID interno'
            'pin-internal-id-tooltip': 'ID utilizado pelo servidor.'
            'Digital': 'Digital'
            'Analog': 'Analógico'
            'Input': 'Entrada'
            'Output': 'Saída'
            'Failed': 'Falhou'
            'Save': 'Salvar'
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
            'Disconnected': 'Verbindung getrennt'
            'Password changed': 'Password geändert'
            'Driver': 'Treiber'
            'Driver setup': 'Treiber Einstellung'
            'Apply setup': 'Einstellung einsetzen'
            'Pin name': 'Port-Namen'
            'Pin alias': 'Port-Alias'
            'Pin mapping': 'Port-Mapping'
            'Pin mapping value': 'Port-Mapping-Wert'
            'pin-name-tooltip': 'Name der physischen Port, nach dem Treiber.'
            'pin-alias-tooltip': 'Ein Alias, den Sie den Port gibt. Wie eine Variable.'
            'Digital/Analog': 'Digital/Analog'
            'pin-digana-tooltip': 'Ob das Port als Digital oder Analog verwendet wird.'
            'Input/Output': 'Eingang/Ausgang'
            'pin-inout-tooltip': 'Ob das Port als Eingang oder Ausgang verwendet wird.'
            'PWM': 'PWM'
            'pin-pwm-tooltip': 'Ob das Port für die Generation eines PWM-Signals verwendet wird. Das Hardware muss es unterstützen.'
            'Initial value': 'Initial Wert'
            'pin-initial-value-tooltip': 'Der Wert wofür das Port am Anfang eingestellt wird, wenn es als Ausgang verwendet ist.'
            'Internal ID': 'Interne ID'
            'pin-internal-id-tooltip': 'ID vom Server verwendet.'
            'Digital': 'Digital'
            'Analog': 'Analog'
            'Input': 'Eingang'
            'Output': 'Ausgang'
            'Failed': 'Gescheitert'
            'Save': 'Speichern'

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
