const { GoogleSpreadsheet } = require('google-spreadsheet');
const credentials = require('./credentials.json');
const file = require('./file.js');

const getDoc = async () => {
    const doc = new GoogleSpreadsheet(file.id);

    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key.replace(/\\n/g, '\n')
    })
    await doc.loadInfo();
    return doc;
}
getDoc().then(doc => {
    console.log(doc.title);
});