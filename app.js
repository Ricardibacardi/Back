const express = require('express')
const cors = require('cors');
const { ObjectId, MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

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
        const data = await colecccionMunicipios.findOne({codigo_postal:cp});
        res.send(data);
    });

    //Añadimos el contrato desde el formulario
    app.post('/addcontract', async function (req, res) {
        const nextId = await colleccionContratos.findOne({},{sort:{_id:-1}});
        req.body.idContrato = nextId.idContrato+1;
        const data = await colleccionContratos.insertOne(req.body);
        res.send(data);
    });

    //Modificamos el contrato seleccionado desde la modal
    app.put('/modifycontract/:oid', async function (req, res) {
        const contractId = ObjectId(req.params.oid);
        const data = await colleccionContratos.updateOne({_id:contractId},{$set:req.body});
        res.send(data);
    });

    //Borramos el contrato de la linea
    app.delete('/deletecontract/:oid', async function (req, res) {
        const contractId = ObjectId(req.params.oid);
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
    app.get('/getcontract/:oid', async function (req, res) {
        const contractId = ObjectId(req.params.oid);
        const data = await colleccionContratos.findOne({_id:contractId});
        res.send(data);
    });


    app.listen(8000, () => {
        console.log('Te escucho')
    });
    return 'Ok';
}

main().then(console.log).catch(console.error)