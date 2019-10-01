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
      res.status(500).json({ error: "The blogss information could not be retrieved."});
    });
});

// get by id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  console.log(id)
  db.findById(id)
    .then(blog => {
      blog ? res.status(200).json(blog) : res.status(404).json({  message: `The blogs with the specified ID ${id} does not exist.` })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({  message: 'Error retrieving the hub' });
    });
});

// Make blogs request to api/blogs



// export router
module.exports = router;