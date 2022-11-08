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
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const pizzaCollection = client.db('pepperoni').collection('products');

        app.get('/home-products', async (req, res) => {
            const query = {};
            const cursor = pizzaCollection.find(query);
            const allPizza = await cursor.limit(3).toArray();
            res.send(allPizza);
            console.log(allPizza);
        });

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = pizzaCollection.find(query);
            const allPizza = await cursor.toArray();
            res.send(allPizza);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const pizza = await pizzaCollection.findOne(query);
            res.send(pizza);
        });

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