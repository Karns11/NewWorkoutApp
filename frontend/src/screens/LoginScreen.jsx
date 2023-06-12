import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Container } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

import { CssBaseline, Grid, Typography } from "@mui/material";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    // <div className="loginScreen-wrapper">
    //   <Row className="loginScreen-row">
    //     <Col sm={6}>
    //       <div className="register-pic">
    //         <img alt="vibeyPic" src={vibe1} />
    //       </div>
    //     </Col>
    //     <Col sm={6}>
    //       <FormContainer>
    //         <h1>Sign In</h1>

    //         <Form onSubmit={submitHandler}>
    //           <Form.Group controlId="email" className="my-3">
    //             <Form.Label>Email Address</Form.Label>
    //             <Form.Control
    //               type="email"
    //               placeholder="Enter email"
    //               value={email}
    //               onChange={(e) => setEmail(e.target.value)}
    //             ></Form.Control>
    //           </Form.Group>

    //           <Form.Group controlId="password" className="my-3">
    //             <Form.Label>Password</Form.Label>
    //             <Form.Control
    //               type="password"
    //               placeholder="Enter password"
    //               value={password}
    //               onChange={(e) => setPassword(e.target.value)}
    //             ></Form.Control>
    //           </Form.Group>
    //           <Button type="submit" variant="primary" className="mt-2">
    //             Sign In
    //           </Button>
    //           {isLoading && <Loader />}
    //         </Form>
    //         <Row className="py-3">
    //           <Col>
    //             New Customer?{" "}
    //             <Link
    //               to={redirect ? `/register?redirect=${redirect}` : "/register"}
    //             >
    //               Register
    //             </Link>
    //             <Row>
    //               <Col>
    //                 <Link className="btn btn-light" to="/">
    //                   Go Back
    //                 </Link>
    //               </Col>
    //             </Row>
    //           </Col>
    //         </Row>
    //       </FormContainer>
    //     </Col>
    //   </Row>
    // </div>
    <div className="register-screen">
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
              Sign in
            </Typography>

            <Form onSubmit={submitHandler}>
              <Form.Group controlId="email" className="my-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              <div className="d-flex justify-content-center">
                <Button type="submit" variant="primary" className="mt-2">
                  Sign In
                </Button>
              </div>
              <Row className="text-center py-3">
                <Col>
                  New Customer?{" "}
                  <Link
                    to={
                      redirect ? `/register?redirect=${redirect}` : "/register"
                    }
                  >
                    Register
                  </Link>
                </Col>
              </Row>

              {isLoading && <Loader />}
            </Form>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginScreen;
