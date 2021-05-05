const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
    
});

app.post('/posts/create', (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    console.log(req);
    posts[id] = {
        id,
        title
    };
    console.log('4000:got post here');

    axios.post('http://event-bus-srv:4005/events', {
        
        type: 'PostCreated',
        data: {
            id,
            title
        }
    });

    res.status(201).send(posts[id]);
});

app.listen(4000, () => {
    console.log("v1");
    console.log('Listening on 4000');
});


app.post('/events', (req, res) => {
    console.log('Event Recievend', req.body.type);
    res.send({});
})