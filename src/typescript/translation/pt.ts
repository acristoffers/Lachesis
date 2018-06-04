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
    'System Response': 'Resposta do Sistema',
    'System Control': 'Controle do Sistema',
    'Moirai Address': 'Endereço do Moirai',
    'Password': 'Senha',
    'Connect': 'Conectar',
    'Error when connecting. Check address and try again.': 'Erro ao conectar. Verifique a conexão e tente novamente.',
    'Wrong password.': 'Senha incorreta',
    'Connected': 'Conectado',
    'Change Password': 'Alterar senha',
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
    'Just like in Formula, x stands for the input value.': 'Assim como em Fórmula, x é o valor de entrada.',
    'Something went wrong. Please try again later.': 'Algo deu errado. Favor tente novamente mais tarde.',
    'Interlock': 'Intertravamento',
    'Value': 'Valor',
    'Expression': 'Expressão',
    'Static Calibration': 'Calibração Estática',
    'Edit': 'Editar',
    'Save': 'Salvar',
    'Run': 'Executar',
    'Cancel': 'Cancelar',
    'Tests': 'Testes',
    'Curve data': 'Dados da curva',
    'Input/Output Configuration': 'Configuração de entrada/saída',
    'Output to control': 'Saída a controlar',
    'Inputs to log': 'Entradas a registrar',
    'Log Rate': 'Taxa de registro',
    'Log Rate (seconds)': 'Taxa de registro (segundos)',
    'Fixed outputs': 'Saídas fixas',
    'After test outputs': 'Saídas após os testes',
    'Add/Edit Test': 'Adicionar/editar teste',
    'Step': 'Passo',
    'Impulse': 'Impulso',
    'Wide Pulse': 'Pulso largo',
    'Stair': 'Escada',
    'Free Form': 'Forma livre',
    'Name': 'Nome',
    'Time (seconds)': 'Tempo (segundos)',
    'T0 (seconds)': 'T0 (segundos)',
    'T1 (seconds)': 'T1 (segundos)',
    'T2 (seconds)': 'T2 (segundos)',
    't (seconds)': 't (segundos)',
    'Show': 'Exibir',
    'Points': 'Pontos',
    'Exported Name': 'Nome Exportado',
    'Graphs': 'Gráficos',
    'Import': 'Importar',
    'Export': 'Exportar',
    'Sync': 'Sincronizar',
    'Saved Controllers': 'Controladores Salvos',
    'Free': 'Livre',
    'Data Points': 'Pontos',
    'Supported formats: CSV and JSON': 'Formatos suportados: CSV e JSON',
    'CSV: x in first column, y in second. Use csvwrite("data.csv", transpose([x; y])) in MATLAB/Octave to generate such file from x and y variables.': 'CSV: x na primeira coluna, y na segunda. Use csvwrite("data.csv", transpose([x; y])) no MATLAB/Octave para gerar tal arquivo das variáveis x e y.',
    'Sampling Time': 'Tempo de amostra',
    'Total Run Time': 'Tempo total de execução',
    'Add/Edit Controller': 'Adicionar/Editar controlador',
    'Inputs': 'Entradas',
    'For better performance, not all inputs are scanned. Choose the ones you need below.': 'Para melhorar a performance, nem todas as entradas são escaneadas. Escolha as entradas que você precisa abaixo.',
    'Before': 'Antes',
    'This code will be executed before the controller starts.': 'Este código será executado antes do controlador',
    'Controller': 'Controlador',
    'After': 'Depois',
    'This code will be executed after the controller leaves. Even if something goes wrong.': 'Este código será executado depois do controlador, mesmo se algo der errado.',
    'Stop': 'Parar',
    'Are you sure that you want to delete this item?': 'Tem certeza que deseja excluir este item?',
    'Checking for updates...': 'Buscando atualizações...',
    'No update available': 'Nenhuma atualização disponível',
    'Error checking for updates': 'Erro ao buscar atualizações',
    'Update downloaded. Restart to apply.': 'Atualização baixada. Reinicie para aplicar.',
    'Update available.': 'Atualização disponível',
    'Download': 'Baixar',
    'Downloading ($1)': 'Baixando ($1)',
    'Remove all': 'Remover todos',
    'Backup/Restore': 'Salvar/Restaurar',
    'Backup': 'Salvar',
    'Restore': 'Restaurar',
    'Backup or restore the whole database.': 'Salvar ou restaurar o banco de dados.',
    'This can take some time.': 'Isto pode levar muito tempo.',
    'Select All': 'Selecionar todas',
    'Select None': 'Não selecionar nenhuma',
    'Clone': 'Clonar'
}
