require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require("./models/Employee");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/employee");

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            return res.json(err);
          }
          if (result) {
            const token = jwt.sign({ email: user.email, name: user.name }, jwtSecret, {
              expiresIn: "1h",
            });
            return res.json({ message: "Success", token: token });
          } else {
            res.json("Password is incorrect");
          }
        });
      } else {
        res.json("No record existed");
      }
    })
    .catch((err) => res.json(err));
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  EmployeeModel.findOne({ email: email })
    .then((employee) => {
      if (employee) {
        return res.json("Email already exists");
      } else {
        bcrypt.hash(password, saltRounds, function (err, hash) {
          if (err) {
            return res.json(err);
          }
          const newUser = { name, email, password: hash };
          EmployeeModel.create(newUser)
            .then((employee) => res.json(employee))
            .catch((err) => res.status(500).json(err));
        });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.listen(3001, () => {
  console.log("server is running");
});
