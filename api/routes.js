const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { check, validationResult } = require('express-validator/check');

const { sequelize, models } = require('./db');

// Get references to our models.
const { User, Course } = models;

function asyncHandler(cb){
  return async (req, res, next)=>{
    try {
      await cb(req,res, next);
    } catch(err){
      next(err);
    }
  };
}

const authenticateUser = async (req, res, next) => {
  let message = null;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  // If the user's credentials are available...
  if (credentials) {
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).
    const user = await User.findOne({ where: { emailAddress: credentials.name } });

    // If a user was successfully retrieved from the data store...
    if (user) {
      // Use the bcryptjs npm package to compare the user's password
      // (from the Authorization header) to the user's password
      // that was retrieved from the data store.
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);

      // If the passwords match...
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.username}`);

        // Then store the retrieved user object on the request object
        // so any middleware functions that follow this middleware function
        // will have access to the user's information.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.username}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

   // If user authentication failed...
   if (message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Access Denied' });
  } else {
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
  }
};

// Returns the currently authenticated user

router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.json({
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  });
}));

// Creates a user

router.post('/users', asyncHandler(async (req, res, next) => {
  let user
  console.log(req.body);
  try {
    req.body.password = bcryptjs.hashSync(req.body.password);
    user = await User.create(req.body);
    res.status(201).location("/").end();
  } catch (error) {
    console.log(error)
    if(error.name === "SequelizeValidationError") { // checking the error
      let message = [];
      for (let i = 0; i < error.errors.length; i++) {
        message.push(error.errors[i].message);
      }
      res.status(400).json({message});  
    } else {
      res.status(500);
      next(error);
    }  
  }  
}));

// Returns a list of courses

router.get('/courses', asyncHandler(async (req,res) => {
  const courses = await Course.findAll({
    order: [["title", "ASC"]],
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
        as: 'student',
      }
    ],
  });
  res.json(courses);
}));

// Returns the course for the provided course id

router.get('/courses/:id', asyncHandler(async (req,res) => {
  const id = req.params.id;
  let course = await Course.findAll({
    where: {
      id: id
    },
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
  })
  if (course.length) {
    res.json(course);
  } else {
    res.status(404).json({message: "Error - course not found"})
  }
}));

// Creates a course

router.post('/courses/', authenticateUser, asyncHandler(async (req, res, next) => {
  let course;
  try {
    course = await Course.create(req.body);
    res.status(201).location("/course/" + course.id).end();
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error 
      let message = [];
      for (let i = 0; i < error.errors.length; i++) {
        message.push(error.errors[i].message);
      }
      res.status(400).json({message});  
    } else {
      res.status(500).json({message: "There was an errror on the server."});
    }  
  } 
}));

// Updates a course

router.put('/courses/:id', authenticateUser, [
  check('title')
    .exists()
    .withMessage('Please provide a value for "title"'),
  check('description')
    .exists()
    .withMessage('Please provide a value for "description"'),
], asyncHandler(async (req, res, next) => {
  
  // Attempt to get the validation result from the Request
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    res.status(400).json({ message: errorMessages });
  } else { 
    let course

    try {
      course = await Course.findByPk(req.params.id);
      const user = req.currentUser;
      if (course) {
        const ownerUser = await User.findByPk(course.userId);
        if (course && user.id === ownerUser.id) {
          await course.update(req.body);
          res.status(204).end();
        } else if (user.id !== ownerUser.id) {
          res.status(403).json({ message: "Owner doesn't own the requested course" });
        }
      } else {
        res.status(404).json({ message: "Error - course not found" });
      }
    } catch(error) {
      if(error.name === "SequelizeValidationError") {
        let message = [];
        for (let i = 0; i < error.errors.length; i++) {
          message.push(error.errors[i].message);
        }
        res.status(400).json({message});  
      } else {
        console.log(error);
        res.status(500);
        next(error);
      }
    }
  }
})); 

// Deletes a course

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  const user = req.currentUser;
  const ownerUser = await User.findByPk(course.userId);

  if (course && user.id === ownerUser.id) {
    await course.destroy();
    res.status(204).end();
  } else if (user.id !== ownerUser.id) {
    res.status(403).json({ message: "Owner doesn't own the requested course" });
  } else {
    res.status(404).json({message: "Error - course not found"});
  }
}));

// setup a friendly greeting for the root route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});


module.exports = router;