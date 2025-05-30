import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import signupLogo from './login image.jpeg'


const Signup = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://movielister.onrender.com/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        alert("User has been signed up successfully!");
        console.log(data.message);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        alert(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      // Handle any network or unexpected errors
      alert("An error occurred: " + error.message);
    }
  };
  

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}>
        <img src={signupLogo} alt="login" height={300} width={400} style={{marginRight:'35px',borderRadius:'22px'}}/>

      <div>
      <h2>Signup</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            name="username"
            style={{width:'300px'}}
            value={credentials.username}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            name="email"
            style={{width:'300px'}}
            value={credentials.email}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            name="password"
            style={{width:'300px'}}
            value={credentials.password}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{margin:'20px',fontSize:'20px'}}>
          Sign up
        </Button>

        <p>
          Already have an account? <a href="/login">Log In</a>
        </p>
      </Form>
      </div>
    </div>
  );
};

export default Signup;
