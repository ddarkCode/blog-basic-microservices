const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const postsByIdComments = {};

app.get('/posts/:id/comments', (req, res) => {
  return res.status(200).json(postsByIdComments[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = postsByIdComments[req.params.id] || [];
  comments.push({ id, content });
  postsByIdComments[req.params.id] = comments;
  return res.status(201).json(postsByIdComments[req.params.id]);
});

app.listen(3002, () => console.log('Server is running on port 3002'));
