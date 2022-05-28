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
        const userCollection = client.db('ifad_autos').collection('user')
        const bookingCollection = client.db('ifad_autos').collection('purchase')
        const reviewCollection = client.db('ifad_autos').collection('review')


        app.get('/part', async (req, res) => {
            const query = {};
            const result = await partsCollection.find(query).toArray()
            res.send(result)
        })
        
        app.post('/part', async (req, res) => {
            const newItems = req.body;
            console.log(newItems)
            const result = await partsCollection.insertOne(newItems)
            res.send(result)
        })
                
        app.get('/part/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await partsCollection.findOne(query);
            res.send(result)
        })

        app.delete('/part/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await partsCollection.deleteOne(query)
            console.log(result)
            res.send(result)
        })

        app.get('/allOrder', async (req, res)=>{
            const query = {}
            const result = await bookingCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/allOrder/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await bookingCollection.deleteOne(query)
            console.log(result)
            res.send(result)
        })



        
        app.get('/review', async(req, res)=>{
            const query = {}
            const result = await reviewCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/review', async(req, res)=>{
            const addReview = req.body;
            const result = await reviewCollection.insertOne(addReview)
            res.send(result)
        })

        app.get('/purchased', async (req, res)=>{
            const email =  req.query.email;
            console.log(email)
            const query = {client: email}
            const result = await bookingCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/purchased/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await bookingCollection.deleteOne(query)
            res.send(result)
        })

        app.post('/purchase', async(req, res)=>{
            const part = req.body;
            const result = await bookingCollection.insertOne(part);
            res.send(result)
        })

        app.post('/user', async(req, res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result)            
        })

        app.get('/user', async(req, res)=>{
            const query = {}
            const result = await userCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/user/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })

        app.put('/admin/user/:email', async (req, res)=>{
            const email = req.params.email;
            const filter = {email: email};
            const updateDoc = {
                $set : {role: 'Admin'}
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        app.put('/part/:id', async (req, res)=>{
            const id = req.params.id;
            console.log(id)
            const balQty = req.body.balQty;

            const filter = {_id: ObjectId(id)}
            const options = {upsert : true}
            const avail_Qty = {
                Available_Qty: balQty
            }
            const result = await partsCollection.updateOne(filter, avail_Qty, options);
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