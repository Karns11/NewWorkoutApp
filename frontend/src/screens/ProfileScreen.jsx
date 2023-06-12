import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MainHeader from "../components/MainHeader";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import {
  useGetUserProfileQuery,
  useProfileMutation,
} from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { Link } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

const ProfileScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [height, setHeight] = useState(1);
  const [weight, setWeight] = useState(1);
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const { refetch } = useGetUserProfileQuery();

  useEffect(() => {
    refetch();
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    setEmail(userInfo.email);
    setHeight(userInfo.height);
    setWeight(userInfo.weight);
  }, [
    userInfo.email,
    userInfo.firstName,
    userInfo.lastName,
    userInfo.height,
    userInfo.weight,
    refetch,
  ]);

  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          firstName,
          lastName,
          email,
          height,
          weight,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="profile-screen">
      <MainHeader />

      <Link className="btn btn-light my-4 mx-5" to="/mainscreen">
        Go Back
      </Link>

      <Container>
        <Row>
          <Col md={3}>
            <Row>
              <Col>
                <h3>Friends</h3>
              </Col>
              <Col>
                <Link className="btn btn-primary" to={"/profile/addfriends"}>
                  Add friends
                </Link>
              </Col>
            </Row>

            <div style={{ maxHeight: "620px", overflowY: "auto" }}>
              <List
                sx={{
                  width: "100%",
                  maxWidth: "100%",
                  bgcolor: "background.paper",
                }}
              >
                {!userInfo.friends ? (
                  <Typography>No friends</Typography>
                ) : (
                  userInfo.friends.map((friend) => (
                    <Link
                      key={friend.user}
                      style={{ textDecoration: "none", color: "black" }}
                      to={`/profile/friends/${friend.user}?prev=/profile`}
                    >
                      <div>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar alt={friend.firstName} src="" />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{ fontWeight: "bold" }}
                                variant="body1"
                              >
                                {friend.firstName + " " + friend.lastName}
                              </Typography>
                            }
                            // secondary={
                            //   <React.Fragment>
                            //     <Typography
                            //       sx={{ display: "inline" }}
                            //       component="span"
                            //       variant="body2"
                            //       color="text.primary"
                            //     >
                            //       {friend.workouts.length} workouts
                            //     </Typography>
                            //   </React.Fragment>
                            // }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </div>
                    </Link>
                  ))
                )}
              </List>
            </div>
          </Col>
          <Col md={9}>
            <h2 className="mt-1">User Profile</h2>

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

              <Form.Group className="my-2" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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

              <Form.Group className="my-2" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              {loadingUpdateProfile && <Loader />}
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfileScreen;
