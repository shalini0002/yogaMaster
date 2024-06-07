const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nf43jkb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to MongoDB
client.connect()
  .then(() => {
    console.log("Connected to MongoDB");

    // Initialize database and collections
    const database = client.db("yoga-master");
    const userCollections = database.collection("users");
    const classesCollection = database.collection("classes");
    const cartCollection = database.collection("cart");
    const paymentCollection = database.collection("payments");
    const enrolledCollection = database.collection("enrolled");
    const appliedCollection = database.collection("applied");

    // Define your routes here
    app.post('/new-class', async (req, res) => {
        const newClass = req.body;
        const result = await classesCollection.insertOne(newClass);
        res.send(result);
    });

    app.get('/classes', async(req, res) => {
      const query = { title: "approved"};
      const result = await classesCollection.find().toArray();
      res.send(result);
    }) ;

    //get classes by instructor email address
    app.get('/classes/:email', async(req, res) => {
      const email = req.params.email;
      const query = {instructorEmail: email};
      const result = await classesCollection.find(query).toArray();
      res.send(result);

    })
    
    //manage classes
    app.get('/classes-manage', async(req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);

    })

    //update classes
    app.patch('/change-status/:id', async(req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const reason = req.body.reason;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: status,
          reason: reason,
        },
      };
      const result = await classesCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })
    
    app.get('/approved-classes', async(req, res) => {
const query = { status: 'approved' };
    })

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  }).catch(error => {
    console.error("Failed to connect to MongoDB:", error);
  });
