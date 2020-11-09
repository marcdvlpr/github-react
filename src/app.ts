import express from 'express';

const app = express();

app.use('/', (req, res) => {
  return res.json('Hello from Food Order Server!');
})

export default app;
