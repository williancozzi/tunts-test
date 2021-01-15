const { GoogleSpreadsheet } = require('google-spreadsheet');
const credentials = require('./credentials.json');
const file = require('./file.js');

const classes = 60; // number of total classes

const getDoc = async () => {
    const doc = new GoogleSpreadsheet(file.id);

    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key.replace(/\\n/g, '\n')
    })
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    await sheet.loadCells('A1:H27'); // loads a range of cells

    // manipulate students
    try {

        for (let index = 3; index < 27; index++) {
            let situation = sheet.getCell(index, 6); // access cells using a zero-based index
            let name = sheet.getCell(index, 1).value;
            let missedClasses = sheet.getCell(index, 2).value;

            // average
            let grade1 = sheet.getCell(index, 3).value;
            let grade2 = sheet.getCell(index, 4).value;
            let grade3 = sheet.getCell(index, 5).value;
            let average = (grade1 + grade2 + grade3) / 3;

            // conditions
            if (average < 50) {
                situation.value = "Reprovado por Nota";
            } else if (average >= 50 && average < 70) {
                situation.value = "Exame Final";
            } else if (average >= 70) {
                situation.value = "Aprovado";
            }

            const percentageMiss = ((100 / classes) * missedClasses);
            console.log(percentageMiss);

            if (percentageMiss > 25) {
                situation.value = "Reprovado por Falta";
            }

            //console.log(name + ' ' + average + ' ' + situation.value);

        }
    } catch (error) {
        console.log("Error: ", error);
    }
    await sheet.saveUpdatedCells();
}

getDoc();