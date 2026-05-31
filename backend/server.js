const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/students", (req, res) => {
  const sql = "SELECT * FROM students";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

app.post("/students", (req, res) => {
  const {
    rollNo,
    name,
    email,
    phone,
    dob,
    department,
    gender,
    activities,
    address,
  } = req.body;

  const sql = `
  INSERT INTO students
  (rollNo,name,email,phone,dob,department,gender,activities,address)
  VALUES (?,?,?,?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [
      rollNo,
      name,
      email,
      phone,
      dob,
      department,
      gender,
      activities,
      address,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Student Added",
      });
    }
  );
});

app.delete("/students/:id", (req, res) => {
  const sql = "DELETE FROM students WHERE id=?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Deleted",
    });
  });
});

app.put("/students/:id", (req, res) => {
  const {
    rollNo,
    name,
    email,
    phone,
    dob,
    department,
    gender,
    activities,
    address,
  } = req.body;

  const sql = `
  UPDATE students
  SET
  rollNo=?,
  name=?,
  email=?,
  phone=?,
  dob=?,
  department=?,
  gender=?,
  activities=?,
  address=?
  WHERE id=?
  `;

  db.query(
    sql,
    [
      rollNo,
      name,
      email,
      phone,
      dob,
      department,
      gender,
      activities,
      address,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Updated",
      });
    }
  );
});

app.listen(5000, () => {
  console.log("Server Running On Port 5000");
});