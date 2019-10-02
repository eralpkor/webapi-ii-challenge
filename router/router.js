const express = require('express');
const router = express.Router();
const db = require('../data/db.js');

// any url that begins with /api/blogss get all of the blogss
router.get('/', (req, res) => {
  db.find(req.query)
    .then(blogs => {
      res.status(200).json(blogs)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "The blogs information could not be retrieved."
      });
    });
});

// get by id
router.get('/:id', (req, res) => {
  const { id } = req.params;
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
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({ error: 'Error getting post.'});
        })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "There was an error while saving the post to the database" });
    });
});

// PUT request to update stuff
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res.status(404).json({errorMessage: "Please provide title and contents for the post."});
  }
  db.update(id, {title, contents })
    .then((updated) => {
      console.log(updated)
      updated ? db.findById(id)
        .then(([post]) => res.status(201).json(post))
        .catch(err => {
          console.log(err)
          res.status(500).json({ error: 'Error getting post.'});
        })
      : res.status(404).json({message: `The post with the specified ID ${id} does not exist.` })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "There was an error while saving the post to the database" });
    });
});

// Delete posts
router.delete('/:id', (req, res) => {
  const { id } =req.params;
  db.remove(id)
    .then(deleted => {
      deleted ? res.status(204).end() : res.status(404).json({ message: `The post with the specified ID ${id} does not exist.` });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The post could not be removed" });
    })
});

// GET all the comments with ID
router.get('/:id/comments', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(([post]) => {
      if (post) {
        db.findPostComments(id)
        .then(([comment]) => {
          console.log(comment)
          comment ? res.status(200).json(comment) : res.status(404).json({ message: `The post with the specified ID ${id} does not exist.` })
        })
      } else {
        res.status(404).json({ message: `The post with the specified ID ${id} does not exist.` })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The comments information could not be retrieved." });
    })
});

// POST request to comments
router.post('/:post_id/comments', (req, res) => {
  const { post_id } = req.params;
  const { text } = req.body;

  db.insertComment({ text, post_id })
    .then(({id: comment_id}) => {
      db.findCommentById(comment_id)
        .then(([comment]) => {
          comment ? res.status(200).json(comment_id) : res.status(404).json({message: `The post with the specified ID ${id} does not exist.`})
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "Getting comment issue..."})
        })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "There was an error while saving the comment to the database"})
    })
})

// export router
module.exports = router;

[ { id: 3,
  text:
   'Not-knowing is true knowledge. Presuming to know is a disease.',
  created_at: '2019-05-11 01:55:52',
  updated_at: '2019-05-11 01:55:52',
  post_id: 2,
  post:
   'I think we should get off the road. Get off the road! Quick!' } ]