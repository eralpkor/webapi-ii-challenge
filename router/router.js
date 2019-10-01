const express = require('express');
const router = express.Router();
const db = require('../data/db.js');

// any url that begins with /api/blogss get all of the blogss
router.get('/', (req, res) => {
  db.find(req.query)
    .then(blogss => {
      res.status(200).json(blogss)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "The blogss information could not be retrieved."
      });
    });
});

// get by id
router.get('/:id', (req, res) => {
  const {
    id
  } = req.params;
  console.log(id)
  db.findById(id)
    .then(([blog]) => {
      blog ? res.status(200).json(blog) : res.status(404).json({
        message: `The blogs with the specified ID ${id} does not exist.`
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error retrieving the hub'
      });
    });
});

// Make blogs request to api/blogs
router.post('/', (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res.status(404).json({errorMessage: "Please provide title and contents for the post."});
  }
  db.insert({ title, contents })
    .then(({id}) => {
      db.findById(id)
        .then(([post]) => {
          res.status(201).json(post);
        });
    })
    .catch(err => {
      console.log(err)
    })
})

// export router
module.exports = router;