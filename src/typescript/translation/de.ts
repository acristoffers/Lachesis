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

export const LANG_DE_NAME = 'de'

export const LANG_DE_TRANS = {
    'English': 'Englisch',
    'French': 'Französisch',
    'German': 'Deutch',
    'Portuguese': 'Portuguisisch',
    'Language': 'Sprache',
    'Connection': 'Verbindung',
    'Hardware Setup': 'Hardware Einstellung',
    'System Identification': 'Systemidentifikation',
    'System Control': 'Steuerungssysteme',
    'Moirai Address': 'Moirai Adresse',
    'Password': 'Passwort',
    'Connect': 'Verbinden',
    'Error when connecting. Check address and try again.': 'Verbindung fehlgeschlagen. Überprüfen Sie die Addresse und versuchen Sie es nochmal.',
    'Wrong password.': 'Falsches Passwort',
    'Connected': 'Verbunden',
    'Disconnect': 'Verbindung trennen',
    'Driver': 'Treiber',
    'Apply': 'Verwenden',
    'Setup': 'Einstellung',
    'Ports': 'Ports',
    'Port Name': 'Port Name',
    'Port Alias': 'Port Alias',
    'Port Type': 'Port-Typ',
    'Digital': 'Digital',
    'Analog': 'Analog',
    'Input': 'Eingang',
    'Output': 'Ausgang',
    'PWM': 'PWM',
    'Initial Value': 'Anfangswert',
    'Internal ID': 'Interne ID',
    'Success!': 'Erfolg!',
    'Add': 'Einfügen',
    'Remove': 'Löschen',
    'Calibration': 'Kalibrierung',
    'Port': 'Port',
    'Alias': 'Alias',
    'Formula': 'Formel',
    'Reset': 'Wiederstellen',
    'Fill the driver setup options. For information about the properties, read the documentation of the AHIO library.': 'Füllen Sie die Treiber-Setup-Optionen. Für Informationen über die Argumenten lesen Sie bitte die Dokumentation der AHIO-Bibliothek.',
    'The name of the port as known by the AHIO driver.': 'Der name des Ports wie beim AHIO Triber bekannt.',
    'A valid python variable name that will be used in code to refer to this port value.': 'Ein gültiger python-Variablenname, der in Code verwendet wird, um auf diesen Portwert zu verweisen.',
    'The formula that calibrates this port. Use the variable x in place of the value of the input. If port is of type Input, the value of the input will be passed through the expression. If it an output, the value assigned to the variable will be passed through the expression before sending to the driver.': 'Die Formel, die diesen Port kalibriert. Verwenden Sie die Variable x anstelle des Wertes der Eingabe. Wenn Port vom Typ Eingang ist, wird der Wert der Eingabe durch den Ausdruck übergeben. Wenn es eine Ausgang ist, wird der Wert, der der Variablen zugewiesen wird, durch den Ausdruck übergeben, bevor er an den Treiber sendet.',
    'Sets the output of some port to some value if Expression evaluates to true.': 'Setzt die Ausgabe eines Portes auf einen Wert, wenn Expression auf Wahr ausgewertet wird.',
    'Just like in Formula, x stands for the input value.': 'Genau wie in der Formel steht x für den Eingabewert.',
    'Something went wrong. Please try again later.': 'Etwas ist schief gelaufen. Bitte versuchen Sie es später noch einmal.',
    'Interlock': 'Verriegelung',
    'Value': 'Wert',
    'Expression': 'Ausdruck'
}
