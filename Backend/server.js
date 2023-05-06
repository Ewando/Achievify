const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nedb = require('nedb');
const bcrypt = require("bcryptjs");
const app = express();

//NEDB

const userDB = new nedb({filename:'users.db', autoload:true});
const oneOffgoalsDB = new nedb({filename:'oneOffgoals.db', autoload:true});
const recurringGoalsDB = new nedb({filename:'recurringGoals.db', autoload:true});

app.use(cors()); 
app.use(express.json());
app.use(express.static('public'));

//Handle register request

app.post("/register", (req, res) => {

  const { name, email, password } = req.body;

  userDB.findOne({ email }, (err, user) => {

    if(err) {
      console.log(err);
      res.status(500).send("Error registering user");
    } else if(user) {
      res.status(409).send("Email already registered, try again");
    } else {

      bcrypt.hash(password, 10, (err, hashedPassword) => {

        if(err) {
          console.log(err);
          res.status(500).send("Error registering user");
        }else {
          const user = {
            name,
            email,
            password: hashedPassword,
          };

          userDB.insert(user, (err, newUser) => {

            if(err) {
              console.log(err);
              res.status(500).send("Error registering user");
            }else {
              res.status(200).json(newUser);
            }

          });

        }

      });

    }

  });

});

//Handle login request

app.post("/login", (req, res) => {

  const { email, password } = req.body;

  userDB.findOne({ email }, (err, user) => {

    if(err) {

      console.log(err);
      res.status(500).send("Error logging in");

    }else if (!user) {

      res.status(401).send("Invalid email or password");

    } else {

      bcrypt.compare(password, user.password, (err, isMatch) => {

        if(err) {

          console.log(err);
          res.status(500).send("Error logging in");

        } else if(!isMatch) {

          res.status(401).send("Invalid email or password");

        } else {
          const id = user._id;
          const token = jwt.sign({ userId: user.id }, 'my-secret-key');
          return res.status(200).json({ token, id });

        }

      });
    }
  });
});

// GET USERS ONE-OFF GOALS 

app.get("/getOneOffGoals/:userID", (req, res) => {

  const userID = req.params.userID;

  oneOffgoalsDB.find({ user_id: userID }, (err, goals) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving goals");
    } else {
      res.status(200).json(goals);
    }
  });

});

// ADD ONE-OFF GOAL

app.post("/addNewOneOffGoal", (req, res) => {
  const { user_id, name, category, date, isComplete } = req.body;
  const goal = {
    user_id,
    name,
    category,
    date,
    isComplete
  };
  oneOffgoalsDB.insert(goal, (err, newGoal) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error adding goal");
    } else {
      res.status(200).json(newGoal);
    }
  });
});

// DELETE ONE OFF GOAL

app.post("/deleteOneOffGoal/:goalID", (req, res) => {

  const id = req.params.goalID;

  oneOffgoalsDB.remove({ _id: id}, {}, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Removed old goal`);
    }
  });

  oneOffgoalsDB.loadDatabase();

});

// COMPLETE ONE OFF GOAL

app.post("/completeOneOffGoal/:goalID", (req, res) => {

  const id = req.params.goalID;

  oneOffgoalsDB.update({ _id: id }, { $set: { isComplete: true } }, {}, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Completed goal successfully.`);

      // Chain the remove operation after the update is successful.
      oneOffgoalsDB.remove({ _id: id, isComplete: false }, {}, (err, numRemoved) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Removed old goal`);
        }
      });
    }
  });

  oneOffgoalsDB.loadDatabase();

});

// GET USERS RECURRING GOALS

app.get("/getRecurringGoals/:userID", (req, res) => {

  const userID = req.params.userID;

  recurringGoalsDB.find({ user_id: userID }, (err, goals) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving goals");
    } else {
      res.status(200).json(goals);
    }
  });

});

// ADD RECURRING GOAL

app.post("/addRecurringGoal", (req, res) => {

  const { user_id, name, category, day, isComplete } = req.body;

  const goal = {
    user_id,
    name,
    category,
    day,
    isComplete
  };

  recurringGoalsDB.insert(goal, (err, newGoal) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error adding goal");
    } else {
      res.status(200).json(newGoal);
    }
  });
});

// DELETE RECURRING GOAL

app.post("/deleteRecurringGoal/:goalID", (req, res) => {

  const id = req.params.goalID;

  recurringGoalsDB.remove({ _id: id}, {}, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Removed old goal`);
    }
  });

  recurringGoalsDB.loadDatabase();

});

// COMPLETE RECURRING GOAL

app.post("/completeRecurringGoal/:goalID", (req, res) => {

  const id = req.params.goalID;

  recurringGoalsDB.update({ _id: id }, { $set: { isComplete: true } }, {}, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Completed goal successfully.`);

      // Chain the remove operation after the update is successful.
      recurringGoalsDB.remove({ _id: id, isComplete: false }, {}, (err, numRemoved) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Removed old goal`);
        }
      });
    }
  });

  recurringGoalsDB.loadDatabase();

});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '../Frontend/public/' });
  });

app.use(function(req, res) {
  res.status(404);res.send('404: not found'); 
});

app.listen(3001, function() {
  console.log('Server started on port 3000. Ctrl^c to quit.'); 
});


