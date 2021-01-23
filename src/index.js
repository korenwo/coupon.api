const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
const port = 4001;
let db;

app.use(bodyParser.json());

app.put('/coupon', (req, res)=>{
    const { date, isRedeem} = req.body;
    const code = Math.floor(Math.random()*10000);
    db.collection("couponCollection")
    .insertOne({ date, isRedeem, code })
    .then((report) => {
        res.sendStatus(201);
    })
    .catch((e)=>{
        console.log(e);
        res.sendStatus(500);
    });
});

app.get('/coupon', (req, res)=>{
    db.collection("couponCollection")
    .find()
    .toArray()
    .then((users) => {
        res.send(users);
    });
});

app.get('/coupon/:code', (req, res)=>{
    db.collection("couponCollection")
    .findOne({ code: parseInt(req.params.code)})
    .then((coupon)=> {
        if(!coupon) {
            res.sendStatus(404);
            return;
        }
        res.send(coupon);
    });
});

app.post('/coupon/:code', (req, res)=>{
    const { date, isRedeem} = req.body;
    db.collection("couponCollection")
    .updateOne({ code: parseInt(req.params.code)}, {$set: { date, isRedeem }})
    .then((coupon)=> {
        res.sendStatus(200);
    });
});    

app.delete('/coupon/:code', (req, res)=> {
    db.collection("couponCollection")
    .deleteOne({code: parseInt(req.params.code) })
    .then((report) => {
        if (report.deleteCount === 0) {
            res.sendStatus(404);
            return; 
        }
        res.sendStatus(204);
    });
});    

app.post('/coupon/:code/redeem', (req, res)=> {
    db.collection("couponCollection")
    .updateOne({ code: parseInt(req.params.code)}, {$set: { isRedeem : true }})
    .then((coupon)=> {
        res.sendStatus(200);
    });
});    

const client = new MongoClient('mongodb://localhost:27017',{useUnifiedTopology: true});
client.connect()
    .then(() => {
        db= client.db('coupons-app');
        app.listen(port, () => console.log (`Server listening on port ${port}!`));
    })
    .catch((e) => console.log ('Could not connect to Mongodb'));
 