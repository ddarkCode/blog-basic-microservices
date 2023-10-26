const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const posts = {};

function handleEvents(type, data) {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { postId, id, content, status } = data;
    const post = posts[postId];

    post.comments.push({ id, content, status });
  }

  if (type === 'CommentModerated') {
    const { postId, status, content, id } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    console.log(comment);
    comment.status = status;
    comment.content = content;
    console.log(comment);
  }
}

app.get('/posts', async (req, res) => {
  return res.status(200).json(posts);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  console.log(req.body);

  handleEvents(type, data);

  return res.status(201).json('ok');
});

app.listen(4002, async () => {
  console.log('Server is running on port 4002');

  const { data } = await axios.get('http://event-bus-cluster-srv:4005/events');
  console.log('Query Server Listen Function', data);

  if (data.length > 0) {
    for (let event of data) {
      handleEvents(event.type, event.data);
    }
  }
});
