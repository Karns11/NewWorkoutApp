import React, { useEffect, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import MainHeader from "../components/MainHeader";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import {
  useGetUserProfileQuery,
  useProfileMutation,
} from "../slices/usersApiSlice";
import FormContainer from "../components/FormContainer";
import { setCredentials } from "../slices/authSlice";
import { Link } from "react-router-dom";

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

  const {
    data: userProfile,
    isLoading: loadingGetProfile,
    refetch,
  } = useGetUserProfileQuery();

  console.log(userProfile);

  useEffect(() => {
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
    <>
      <MainHeader />
      <Container>
        <Link className="btn btn-light mt-3" to="/mainscreen">
          Go Back
        </Link>
      </Container>
      <FormContainer className="pt-5 mt-5">
        <h2 className="mt-5">User Profile</h2>

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
      </FormContainer>
    </>
  );
};

export default ProfileScreen;
