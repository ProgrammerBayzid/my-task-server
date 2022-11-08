const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


// middelware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.j7rvpzy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const servicesCollection = client.db('photography').collection('services');
        const oderCollection = client.db('photography').collection('orders');
        const reviewCollection = client.db('photography').collection('reviews');



        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result)
        });

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        });


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service)
        });


        // reviews api
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review)
        })


        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        });


        app.get('/orders', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = oderCollection.find(query);
            const order = await cursor.toArray();
            res.send(order)
        });

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await oderCollection.insertOne(order);
            res.send(result)
        });
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await oderCollection.deleteOne(query)
            res.send(result)
        })



        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const result = await reviewCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body })
            res.send(result)
        })


    }
    finally {

    }
}
run().catch(err => console.error(err))












app.get('/', (req, res) => {
    res.send('photography server is running')
})
app.listen(port, (req, res) => {
    console.log(`photography server is running port ${port}`);
})