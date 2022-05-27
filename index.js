const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

// DB_USER=ifad_autos
// DB_PASS=fswooNFggQZ9TBFl

// moddleware

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qdc49cz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()

        const partsCollection = client.db('ifad_autos').collection('parts')


        app.get('/part', async (req, res) => {
            const query = {};
            const result = await partsCollection.find(query).toArray()
            res.send(result)
        })
        
        
        app.get('/part/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await partsCollection.findOne(query);
            res.send(result)
        })
    }
    finally {
        // await client.close();
    }
}



run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('IFAD Server Connected')
})

app.listen(port, () => {
    console.log('ifad server start with', port)
})