import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentForm.css";

function StudentForm() {
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    email: "",
    phone: "",
    dob: "",
    department: "",
    gender: "",
    activities: [],
    address: "",
  });

  const activitiesList = [
    "Acting",
    "Debating",
    "Photography",
    "Writing",
    "Dancing",
    "Drawing",
    "Singing",
    "Nil",
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/students"
      );

      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleActivityChange = (activity) => {
    let updatedActivities = [...formData.activities];

    if (updatedActivities.includes(activity)) {
      updatedActivities = updatedActivities.filter(
        (item) => item !== activity
      );
    } else {
      updatedActivities.push(activity);
    }

    setFormData({
      ...formData,
      activities: updatedActivities,
    });
  };

  const clearForm = () => {
    setFormData({
      rollNo: "",
      name: "",
      email: "",
      phone: "",
      dob: "",
      department: "",
      gender: "",
      activities: [],
      address: "",
    });

    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.rollNo ||
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.dob ||
      !formData.department ||
      !formData.gender ||
      !formData.address
    ) {
      alert("All fields are required");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      alert("Enter valid email");
      return;
    }

    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(formData.phone)) {
      alert("Phone number must contain 10 digits");
      return;
    }

    const year = new Date(
      formData.dob
    ).getFullYear();

    if (year < 2004 || year > 2008) {
      alert("DOB year must be between 2004 and 2008");
      return;
    }

    const studentData = {
      ...formData,
      activities: formData.activities.join(", "),
    };

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/students/${editId}`,
          studentData
        );

        alert("Student Updated Successfully");
      } else {
        await axios.post(
          "http://localhost:5000/students",
          studentData
        );

        alert("Student Added Successfully");
      }

      fetchStudents();
      clearForm();
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  const handleEdit = (student) => {
    setFormData({
      rollNo: student.rollNo,
      name: student.name,
      email: student.email,
      phone: student.phone,
      dob: student.dob
        ? student.dob.split("T")[0]
        : "",
      department: student.department,
      gender: student.gender,
      activities: student.activities
        ? student.activities.split(", ")
        : [],
      address: student.address,
    });

    setEditId(student.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete Student?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/students/${id}`
      );

      fetchStudents();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h1 className="title">
        Student Registration System
      </h1>

      <form onSubmit={handleSubmit} className="form-box">
        <div className="form-group">
          <label>Roll Number</label>

          <input
            type="text"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            placeholder="Enter roll number"
          />
        </div>

        <div className="form-group">
          <label>Full Name</label>

          <div>
            <input
              type="text"
              name="name"
              maxLength="30"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
            />

            <small>
              {formData.name.length}/30
            </small>
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>

          <div>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              min="2004-01-01"
              max="2008-12-31"
            />

            <small>
              Year must be between 2004 and 2008
            </small>
          </div>
        </div>

        <div className="form-group">
          <label>Department</label>

          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">
              -- Select Department --
            </option>

            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
          </select>
        </div>

        <div className="form-group">
          <label>Gender</label>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={
                  formData.gender === "Male"
                }
                onChange={handleChange}
              />
              Male
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={
                  formData.gender === "Female"
                }
                onChange={handleChange}
              />
              Female
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Extracurricular Activities</label>

          <div className="activity-grid">
            {activitiesList.map((activity) => (
              <label key={activity}>
                <input
                  type="checkbox"
                  checked={formData.activities.includes(
                    activity
                  )}
                  onChange={() =>
                    handleActivityChange(activity)
                  }
                />
                {activity}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>

          <textarea
            rows="4"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
        </div>

        <div className="button-group">
          <button className="add-btn" type="submit">
            {editId
              ? "Update Student"
              : "Add Student"}
          </button>

          <button
            type="button"
            className="clear-btn"
            onClick={clearForm}
          >
            Clear
          </button>
        </div>
      </form>

      <h2>Student List</h2>

      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.rollNo}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>
              <td>{student.department}</td>
              <td>{student.gender}</td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() =>
                    handleEdit(student)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(student.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentForm;

