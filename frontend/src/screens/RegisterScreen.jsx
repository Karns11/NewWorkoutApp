import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";
import Loader from "../components/Loader";
import { CssBaseline, Grid, Typography } from "@mui/material";

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/mainscreen";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords Dont Match");
      return;
    } else {
      try {
        const res = await register({
          firstName,
          lastName,
          email,
          height,
          weight,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      {/* <Container className="my-4">
        <Link className="btn btn-light" to="/">
          Go Home
        </Link>
      </Container>
      <FormContainer>
        <h1>Sign Up</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="firstName" className="my-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
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
            <Form.Label>Height (in)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="weight" className="my-3">
            <Form.Label>Weight (lbs)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary" className="mt-2">
            Sign Up
          </Button>

          {isLoading && <Loader />}
        </Form>
        <Row className="py-3">
          <Col>
            Already have an account? <Link to="/login">Login</Link>
          </Col>
        </Row>
      </FormContainer> */}
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} elevation={6}>
          <Container className="mt-3">
            <Link className="btn btn-light" to="/">
              Go Back
            </Link>
          </Container>
          <Container className="mt-5 px-5">
            <Typography className="text-center" component="h1" variant="h5">
              Sign Up
            </Typography>

            <Form onSubmit={submitHandler}>
              <Form.Group controlId="firstName" className="my-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
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
                <Form.Label>Height (in)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="weight" className="my-3">
                <Form.Label>Weight (lbs)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="password" className="my-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="confirmPassword" className="my-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button type="submit" variant="primary" className="mt-2">
                  Sign Up
                </Button>
              </div>

              {isLoading && <Loader />}
            </Form>
            <Row className="text-center py-3">
              <Col>
                Already have an account? <Link to="/login">Login</Link>
              </Col>
            </Row>
          </Container>
        </Grid>
      </Grid>
    </>
  );
};

export default RegisterScreen;
