import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProfileScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    setHeight(userInfo.height);
    setWeight(userInfo.weight);
    setEmail(userInfo.email);
  }, [
    userInfo.email,
    userInfo.firstName,
    userInfo.height,
    userInfo.weight,
    userInfo.lastName,
  ]);

  const submitHandler = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Container className="my-4">
        <Link className="btn btn-light" to="/mainscreen">
          Back
        </Link>
      </Container>
      <Container>
        <Row>
          <Col md={9}>
            <h2>User Profile</h2>

            <Form onSubmit={submitHandler}>
              <Form.Group className="my-2" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="lastName" className="my-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="email" className="my-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="height" className="my-3">
                <Form.Label>Height</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="weight" className="my-3">
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="my-2" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="my-2" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary">
                Update
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProfileScreen;
