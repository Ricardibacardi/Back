const express = require('express')
const { ObjectId, MongoClient } = require('mongodb');

const app = express();


async function main() {
    const uri = 'mongodb://localhost:27017/';
    const client = new MongoClient(uri);

    console.log("entra en main");
    await client.connect();
    console.log("se conecta");


    const db = client.db('Prueba');
    const colleccionContratos = db.collection('contratos');
    const colecccionMunicipios = db.collection('municipios');

    app.get('/', async function (req, res) {
        const data = await colleccionContratos.find({}).toArray();
        res.send(data);
    });

    app.listen(8000, () => {
        console.log('Example app listening on port 8000!')
    });
    return 'Ok';
}

main()