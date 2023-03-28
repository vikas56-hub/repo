import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('/api/courses') 
      .then(res => {
        setCourses(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1>Enrolled Courses</h1>
      {courses.map(course => (
        <div key={course._id}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
};

export default UserDashboard;
