const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const RawData = require('./models/rawData');

const Broker1Topic = require('./models/broker1Topic');
const app = express();
var cors = require('cors')

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.post('/topics', async (req, res) => {
  console.log('TRYING TO STORE TOPIC');

  const topic = {
    userid: req.body.userid,
    topic: req.body.topic
  }
  console.log(topic);


  const topicdata = new Broker1Topic(topic);
  const topicRow = await Broker1Topic.findOne(topic)
  console.log(topicRow)
  if (topicRow != null) {
    res.status(500).json({ message: 'Already subscribed to Topic.' });
  }

  else {
    try {
      console.log(topicdata)
      console.log(req.body)
      await topicdata.save();
      res
        .status(201)
        .json({
          message: 'Successfully subscribed to topic', topic: { userid: topic.userid, topic: topic.topic }
        });
    } catch (err) {
      console.error('ERROR FETCHING topic');
      console.error(err.message);
      res.status(500).json({ message: 'Failed to save topic.' });
    }
  }
});

app.post('/deleteTopic', async (req, res) => {
  console.log('TRYING TO Delete TOPIC');

  const topic = {
    userid: req.body.userid,
    topic: req.body.topic
  }
  console.log(topic);


  const topicRow = await Broker1Topic.deleteOne(topic)
  console.log(topicRow)
  if (topicRow != null) {
    res.status(200).json({ message: 'Deleted Subscription for topic!' });

  }

});
let currentTime = 0;



app.get('/filtertopic/topic11/:userid', async (req, res) => {

  const topic = {
    userid: req.params.userid,
    topic: 'Ethereum'
  }
  const topicRow = await Broker1Topic.findOne(topic)
 if(topicRow!=null)
 { result = []
 

  const rawTopicss = await RawData.find();
  rawTopicss.forEach(element => {
    
      element.name == 'Ethereum' ? result.push(element) : ''
    

  });
  res.send(result)
  console.log(result)}
  else{
    result=[]
    res.send(result)
  }
});app.get('/filtertopic/topic12/:userid', async (req, res) => {

  const topic = {
    userid: req.params.userid,
    topic: 'Electroneum'
  }
  const topicRow = await Broker1Topic.findOne(topic)
 if(topicRow!=null)
 { result = []
 

  const rawTopicss = await RawData.find();
  rawTopicss.forEach(element => {
    
      element.name == 'Electroneum' ? result.push(element) : ''
    

  });
  res.send(result)
  console.log(result)}
  else{
    result=[]
    res.send(result)
  }
});




mongoose.connect(
  'mongodb://root:root@mongodb:27017/crypto?authSource=admin',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('FAILED TO CONNECT TO MONGODB');
      console.error(err);
    } else {
      console.log('CONNECTED TO MONGODB!!!');
     app.listen('80');
//      
    }
  }
);

