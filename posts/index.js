const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  return res.status(200).json(posts);
});

app.post('/posts', (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString('hex');
  posts[id] = { id, title };
  return res.status(201).json(posts[id]);
});

app.listen(3001, () => console.log('server is running on port 3001'));
