const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  return res.status(200).json(posts);
});

app.post('/posts/create', async (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString('hex');
  posts[id] = { id, title };
  await axios.post('http://event-bus-cluster-srv:4005/events', {
    type: 'PostCreated',
    data: { id, title }
  });
  return res.status(201).json(posts[id]);
});

app.post('/events', async (req, res) => {
  console.log(req.body);
  res.status(201).json('ok');
});

app.listen(4000, () => {
  console.log(`server is running on port ${4000}.........................`);
});
