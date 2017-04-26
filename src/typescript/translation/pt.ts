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

export const LANG_PT_NAME = 'pt'

export const LANG_PT_TRANS = {
    'English': 'Inglês',
    'French': 'Francês',
    'German': 'Alemão',
    'Portuguese': 'Português',
    'Language': 'Idioma',
    'Connection': 'Conexão',
    'Hardware Setup': 'Configuração de Hardware',
    'System Identification': 'Identificação do Sistema',
    'System Control': 'Controle do Sistema',
    'Moirai Address': 'Endereço do Moirai',
    'Password': 'Senha',
    'Connect': 'Conectar',
    'Error when connecting. Check address and try again.': 'Erro ao conectar. Verifique a conexão e tente novamente.',
    'Wrong password.': 'Senha incorreta',
    'Connected': 'Conectado',
    'Disconnect': 'Desconectar',
    'Driver': 'Driver',
    'Apply': 'Aplicar',
    'Setup': 'Configuração',
    'Ports': 'Portas',
    'Port Name': 'Nome da porta',
    'Port Alias': 'Alias da porta',
    'Port Type': 'Tipo de porta',
    'Digital': 'Digital',
    'Analog': 'Analógico',
    'Input': 'Entrada',
    'Output': 'Saída',
    'PWM': 'PWM',
    'Initial Value': 'Valor inicial',
    'Internal ID': 'ID interno',
    'Success!': 'Sucesso!',
    'Add': 'Adicionar',
    'Remove': 'Remover',
    'Calibration': 'Calibação',
    'Port': 'Porta',
    'Alias': 'Alias',
    'Formula': 'Fórmula',
    'Reset': 'Reinicializar',
    'Fill the driver setup options. For information about the properties, read the documentation of the AHIO library.': 'Insira as informações de configuração do driver. Para obter informações sobre um driver, consulte a documentação da biblioteca AHIO.',
    'The name of the port as known by the AHIO driver.': 'O nome da porta como conhecido pela biblioteca AHIO.',
    'A valid python variable name that will be used in code to refer to this port value.': 'Um nome de variável válido para ser usado no código python para refernciar o valor desta porta.',
    'The formula that calibrates this port. Use the variable x in place of the value of the input. If port is of type Input, the value of the input will be passed through the expression. If it an output, the value assigned to the variable will be passed through the expression before sending to the driver.': 'A fórmula que calibra esta porta. Use a variável x no lugar do valor de entrada. Se a porta for do tipo Entrada, o valor lido será convertido usando a expressão antes de ser guardado nesta variável. Se for do tipo Saída, o valor guardado na variável será passado pela expressão antes de ser mandado para a saída.',
    'Sets the output of some port to some value if Expression evaluates to true.': 'Altera a saída de alguma porta para algum valor se a Expressão for verdadeira.',
    'Just like in Formula, x stands for the input value.': 'Assim como em Fórmula, x é o valor de entrada.'
}
