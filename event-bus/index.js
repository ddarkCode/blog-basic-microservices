const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const events = [];

app.post('/events', async (req, res) => {
  const event = req.body;

  events.push(event);

  await axios.post('http://posts-cluster-srv:4000/events', event);
  await axios.post('http://comments-cluster-srv:4001/events', event);
  await axios.post('http://query-cluster-srv:4002/events', event);
  await axios.post('http://moderation-cluster-srv:4003/events', event);

  res.status(200).json({ status: 'ok' });
});

app.get('/events', (req, res) => {
  return res.status(200).json(events);
});

app.listen(4005, () => {
  console.log('EventBus Server is runnin on port:4005');
});
