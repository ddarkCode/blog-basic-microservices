const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  console.log(req.body);

  if (type === 'CommentCreated') {
    let { id, content, postId, status } = data;
    status = content.includes('orange') ? 'rejected' : 'approved';

    axios.post('http://event-bus-cluster-srv:4005/events', {
      type: 'CommentModerated',
      data: {
        postId,
        content,
        id,
        status
      }
    });
    console.log('Done');
  }
  return res.status(201).json({});
});

app.listen(4003, () => console.log('Server is running on port 4003'));
