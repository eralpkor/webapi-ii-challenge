const express = require('express');
const server = express();
const blogRouter = require('./router/router.js');

server.use(express.json());
// server to use endpoints from router
server.use('/api/posts', blogRouter);

// run server on '/'
server.get('/', (req, res) => {
  res.send(`
    <h1>Hello Challenge II</h2>
    <p>Node rules...</>
  `)
})

server.listen(5000, () => {
  console.log('\nServer started at port 5000\n')
})