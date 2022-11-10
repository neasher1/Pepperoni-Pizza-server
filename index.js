const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hlzaati.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const pizzaCollection = client.db('pepperoni').collection('products');
        const reviewCollection = client.db('pepperoni').collection('review');

        app.get('/home-products', async (req, res) => {
            const query = {};
            const cursor = pizzaCollection.find(query);
            const allPizza = await cursor.limit(3).toArray();
            res.send(allPizza);
        });

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = pizzaCollection.find(query);
            const allPizza = await cursor.toArray();
            res.send(allPizza);
        });

        //add service
        app.post('/add-services', async (req, res) => {
            const service = req.body;
            const result = await pizzaCollection.insertOne(service);
            res.send(result);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const pizza = await pizzaCollection.findOne(query);
            res.send(pizza);
        });

        //Add reviews in DB
        app.post('/add-review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        // all reviews GET
        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

    }

    finally {

    }

}

run().catch(error => console.log(error));



app.get('/', (req, res) => {
    res.send('Pepperoni Server is Running...')
})

app.listen(port, () => {
    console.log(`Pepperoni app listening on port ${port}`)
})