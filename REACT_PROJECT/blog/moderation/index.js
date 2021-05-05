const express = require('express');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(express.json());




app.post('/events', (req, res) => {
    const { type, data } = req.body;
 
    if (type === "CommentCreated") {
        const { id, content, status, postId } = data;
        const s = content.includes('orange') ? "failed" : "passed";
        
        axios.post('http://event-bus-srv:4005/events', {

            type: 'CommentModerated',
            data: {

                id: id,
                content,
                status: s,
                postId: postId
            }
        });

        



    }
    
});

app.listen(4003, () => {
    console.log("listening on 4003");
})