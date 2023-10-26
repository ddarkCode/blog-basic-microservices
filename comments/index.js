const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const postsByIdComments = {};

app.get('/posts/:id/comments', (req, res) => {
  return res.status(200).json(postsByIdComments[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentsId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = postsByIdComments[req.params.id] || [];

  comments.push({ id: commentsId, content });

  postsByIdComments[req.params.id] = comments;

  axios.post('http://event-bus-cluster-srv:4005/events', {
    type: 'CommentCreated',
    data: { postId: req.params.id, id: commentsId, content, status: 'pending' }
  });

  return res.status(201).json(postsByIdComments[req.params.id]);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  console.log(req.body);

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;

    const comments = postsByIdComments[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
  res.status(201).json('ok');
});

app.listen(4001, () => console.log('Server is running on port 4001'));
