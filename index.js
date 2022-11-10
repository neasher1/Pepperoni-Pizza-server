const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
            const query = { _id: ObjectId(id) };
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
            const cursor = reviewCollection.find(query).sort({ _id: -1 });
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('/my-reviews', async (req, res) => {
            const email = req.query.email;
            let query = {}
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // delete user review 
        app.delete('/my-reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });

        // get specific review
        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            }
            const result = await reviewCollection.findOne(query)
            res.send(result)
        })

        // update review
        app.patch('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            console.log(updateInfo)
            const query = {
                _id: ObjectId(id)
            };
            const updatedDoc = {
                $set: {
                    review: updateInfo.message,
                    rating: updateInfo.rating
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
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