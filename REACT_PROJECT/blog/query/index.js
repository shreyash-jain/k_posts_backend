const express = require('express');
const cors = require('cors');
const app = express();

const axios = require('axios');
app.use(express.json());

app.use(cors());

const posts = {};


app.get('/posts', (req, res) => {
    res.send(posts);
});

const handleEvent = (type, data) => {
    if (type == "PostCreated") {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };

    }

    if (type == "CommentCreated") {
        const { id, content, status, postId } = data;
        const post = posts[postId];

        post.comments.push({ id, content, status });
    }

    if (type == "CommentUpdated") {
        const { commentId, content, status, postId } = data;
        const post = posts[postId];

        const comment = post.comments.find(comment => {
            return comment.id === commentId;
        });
        comment.status = status;
        comment.content = content;
    }


}


app.post('/events', (req, res) => {

    const { type, data } = req.body;



    handleEvent(type, data);

    res.send({});



});

app.listen(4002, async () => {
    console.log("Listening to 4002");

    const res = await axios.get('http://event-bus-srv:4005/events').catch((err) => {
        console.log(err.message);
    });

    for (let event of res.data) {
        console.log('Processing event:', event.type);
        handleEvent(event.type, event.data);
    }
})