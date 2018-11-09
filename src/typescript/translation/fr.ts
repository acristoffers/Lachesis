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

export const LANG_FR_NAME = 'fr'

export const LANG_FR_TRANS = {
    'English': 'Anglais',
    'French': 'Français',
    'German': 'Allemand',
    'Portuguese': 'Portugais',
    'Language': 'Langue',
    'Connection': 'Connexion',
    'Hardware Setup': 'Configuration matérielle',
    'System Identification': 'Identification du système',
    'System Response': 'Réponse du système',
    'System Control': 'Contrôle du système',
    'Moirai Address': 'Adresse du Moirai',
    'Password': 'Mot de passe',
    'Connect': 'Connecter',
    'Change Password': 'Changer le mot de passe',
    'Error when connecting. Check address and try again.': 'Echèc du connexion. Voulez verifier le address et essayer encore.',
    'Wrong password.': 'Mot de passe incorrect.',
    'Connected': 'Connecté',
    'Disconnect': 'Déconnecter',
    'Driver': 'Driver',
    'Apply': 'Appliquer',
    'Setup': 'Configuration',
    'Ports': 'Ports',
    'Port Name': 'Nom de port',
    'Port Alias': 'Alias de port',
    'Port Type': 'Type de port',
    'Digital': 'Numérique',
    'Analog': 'Analogique',
    'Input': 'Entrée',
    'Output': 'Sortie',
    'PWM': 'PWM',
    'Off Value': 'Valeur d\'arrêt',
    'Internal ID': 'ID interne',
    'Success!': 'Succès!',
    'Add': 'Ajouter',
    'Remove': 'Supprimer',
    'Calibration': 'Étalonnage',
    'Port': 'Port',
    'Alias': 'Alias',
    'Formula': 'Formule',
    'Reset': 'Réinitialiser',
    'Fill the driver setup options. For information about the properties, read the documentation of the AHIO library.': 'Remplissez les options de configuration du pilote. Pour plus d\'informations sur les arguments, lisez la documentation de la bibliothèque AHIO.',
    'The name of the port as known by the AHIO driver.': 'Le nom du port tel que connu par le pilote AHIO.',
    'A valid python variable name that will be used in code to refer to this port value.': 'Un nom de variable python valide qui sera utilisé dans le code pour se référer à cette valeur de port.',
    'The formula that calibrates this port. Use the variable x in place of the value of the input. If port is of type Input, the value of the input will be passed through the expression. If it an output, the value assigned to the variable will be passed through the expression before sending to the driver.': 'La formule qui calibre ce port. Utilisez la variable x au lieu de la valeur de l\'entrée. Si le port est de type Entrée, la valeur de l\'entrée passera à travers l\'expression. S\'il s\'agit d\'une sortie, la valeur attribuée à la variable passera à travers l\'expression avant d\'envoyer au conducteur.',
    'Sets the output of some port to some value if Expression evaluates to true.': 'Définit la sortie de certains ports à une certaine valeur si Expression evalue sur true.',
    'Just like in Formula, x stands for the input value.': 'Tout comme dans la formule, x représente la valeur d\'entrée.',
    'Something went wrong. Please try again later.': 'Quelque chose a mal tourné. Veuillez réessayer plus tard.',
    'Interlock': 'Verrouillage',
    'Value': 'Valeur',
    'Expression': 'Expression',
    'Static Calibration': 'Calibration Statique',
    'Edit': 'Modifier',
    'Save': 'Enregistrer',
    'Run': 'Exécuter',
    'Cancel': 'Annuler',
    'Tests': 'Tests',
    'Curve data': 'Données de courbes',
    'Input/Output Configuration': 'Configuration des entrées/sorties',
    'Output to control': 'Sortie à contrôler',
    'Inputs to log': 'Entrées pour journaliser',
    'Log Rate': 'Taux de journalisation',
    'Log Rate (seconds)': 'Taux de journalisation (secondes)',
    'Fixed outputs': 'Sorties fixes',
    'After test outputs': 'Sorties après le test',
    'Add/Edit Test': 'Ajouter/modifier test',
    'Step': 'Pas',
    'Impulse': 'Impulsion',
    'Wide Pulse': 'Pouls large',
    'Stair': 'Escalier',
    'Free Form': 'Forme libre',
    'Name': 'Nom',
    'Time (seconds)': 'Temps (secondes)',
    'T0 (seconds)': 'T0 (secondes)',
    'T1 (seconds)': 'T1 (secondes)',
    'T2 (seconds)': 'T2 (secondes)',
    't (seconds)': 't (secondes)',
    'Show': 'Afficher',
    'Points': 'Points',
    'Exported Name': 'Nom Exporté',
    'Graphs': 'Graphiques',
    'Import': 'Importer',
    'Export': 'Exporter',
    'Sync': 'Synchroniser',
    'Saved Controllers': 'Contrôleur Enregistrée',
    'Free': 'Libre',
    'Data Points': 'Points de données',
    'Supported formats: CSV and JSON': 'Formats pris en charge: CSV and JSON',
    'CSV: x in first column, y in second. Use csvwrite("data.csv", transpose([x; y])) in MATLAB/Octave to generate such file from x and y variables.': 'CSV: x en première colonne, y en seconde. Utiliser csvwriter ("data.csv", transposer ([x; y])) dans MATLAB / Octave pour générer un fichier avec les variables x et y.',
    'Sampling Time': 'Temps d\'échantillonnage',
    'Total Run Time': 'Temps d\'exécution total',
    'Add/Edit Controller': 'Ajouter/Modifier le contrôleur',
    'Inputs': 'Entrées',
    'For better performance, not all inputs are scanned. Choose the ones you need below.': 'Pour une meilleure performance, les entrées ne sont pas tout analysées. Choisissez ceux que vous avez besoin ci-dessous.',
    'Before': 'Avant',
    'This code will be executed before the controller starts.': 'Ce code sera exécuté avant le démarrage du contrôleur.',
    'Controller': 'Contrôleur',
    'After': 'Après',
    'This code will be executed after the controller leaves. Even if something goes wrong.': 'Ce code sera exécuté après la sortie du contrôleur. Même si quelque chose ne va pas.',
    'Stop': 'Arrêter',
    'Are you sure that you want to delete this item?': 'Êtes-vous sûr de vouloir supprimer cet élément?',
    'Checking for updates...': 'Verfication des mises à jour...',
    'No update available': 'Aucune mise à jour disponible',
    'Error checking for updates': 'Erreur de vérification des mises à jour',
    'Update downloaded. Restart to apply.': 'Mise à jour téléchargée Redémarrez pour appliquer.',
    'Update available.': 'Mise à jour disponible.',
    'Download': 'Télécharger',
    'Downloading ($1)': 'Téléchargement en cours ($1)',
    'Remove all': 'Supprimer tout',
    'Backup/Restore': 'Sauvegarder/Restaurer',
    'Backup': 'Sauvegarder',
    'Restore': 'Restaurer',
    'Backup or restore the whole database.': 'Sauvegarder ou restaurer tout le base de données.',
    'This can take some time.': 'Ça peut prendre longtemps.',
    'Select All': 'Tout sélectionner',
    'Select None': 'Tout déselectionner',
    'Clone': 'Cloner',
    'Last error: ': 'Dernière Erreur: ',
    'Past connections': 'Connexions passées',
    'Moirai is outdated. Cannot connect.': 'Moirai est obsolète. Ce n\'est pas possible de se connecter.',
    'Add graph': 'Ajouter graphique',
    'Add graph for each variable': 'Ajouter graphique pour chaque variable',
    'Remove Graph': 'Effacer grafique',
    'Model Simulation': 'Simulation de modèle',
    'Free Control': 'Contrôle libre',
    'Continuous Time': 'Temps continu',
    'Discrete Time': 'Temps discret',
    'Transfer Function': 'Fonction de transfert',
    'State Space': 'Représentation d\'état',
    'All arguments must be compatible with np.array.': 'Tous les arguments doivent être compatibles avec np.array.',
    'You can set u to a vector of outputs.': 'Vous pouvez définir u sur un vecteur de sorties.',
    'Simulation Configuration': 'Configuration de la simulation',
    'Model': 'Modèle',
    'Duration': 'Durée',
    'Simulate': 'Simuler',
    'Error: ': 'Erreur: ',
    'Supported Models': 'Modèles pris en charge',
    'Variables': 'Variables'
}
