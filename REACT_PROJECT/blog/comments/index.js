const express = require('express')
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto')

const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// For Express version less than 4.16.0
// ------------------------------------


const commentsByPostId = {};




app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content, status:"moderation pending" });

    commentsByPostId[req.params.id] = comments;

    axios.post('http://event-bus-srv:4005/events', {

        type: 'CommentCreated',
        data: {

            id:commentId,
            content,
            status:"moderation pending",
            postId: req.params.id
        }
    });

    res.status(201).send(comments);
});
app.post('/events', (req, res) => {
    const { type, data } = req.body;

    if (type == "CommentModerated") {
        const { id, status, postId ,content} = data;
        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
            
        });

        comment.status = status;

        axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                commentId: id,
                postId: postId,
                status: status,
                content
                

            }
        });
    }



    console.log('Event Recievend', req.body.type);
    res.send({});
});
app.listen(4001, () => {
    console.log('Listening on 4001');
});
