const express = require('express')
const { ObjectId, MongoClient } = require('mongodb');

const app = express();

async function main() {
    const uri = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(uri);

    console.log("entra en main");
    await client.connect();
    console.log("se conecta");

    const db = client.db('Prueba');
    const colleccionContratos = db.collection('contratos');
    const colecccionMunicipios = db.collection('municipios');

    //Obtenemos la localidad mediante el cp (codigo postal introducido)
    app.get('/getlocalidad/:cp', async function (req, res) {
        const cp = req.params.cp;
        const data = await colecccionMunicipios.find({codigo_postal:cp}).toArray();
        res.send(data);
    });

    //Añadimos el contrato desde el formulario
    app.post('/addcontract', async function (req, res) {
        const data = await colleccionContratos.insertOne([req.body]);
        res.send(data);
    });

    //Modificamos el contrato seleccionado desde la modal
    app.put('/modifycontract', async function (req, res) {
        const contractId = ObjectId(req.params._id);
        const data = await colleccionContratos.updateOne({_id:contractId},{$set:req.body}).toArray();
        res.send(data);
    });

    //Borramos el contrato de la linea
    app.delete('/deletecontract', async function (req, res) {
        const contractId = ObjectId(req.params._id);
        const data = await colleccionContratos.deleteOne({_id:contractId});
        res.send(data);
    });

    //Obtenemos un listado de contratos
    app.get('/listcontracts', async function (req, res) {
        const data = await colleccionContratos.find({}).toArray();
        res.send(data);
    });

    //Obtenemos un lsitado de municipios
    app.get('/listlocalidades', async function (req, res) {
        const data = await colecccionMunicipios.find({}).toArray();
        res.send(data);
    });

    //Obtenemos la informacion del contrato para imprimirla en la modal
    app.get('/getcontract/:id', async function (req, res) {
        const contractId = ObjectId(req.params._id);
        const data = await colleccionContratos.find({}).toArray();
        res.send(data);
    });


    app.listen(8000, () => {
        console.log('Te escucho')
    });
    return 'Ok';
}

main()