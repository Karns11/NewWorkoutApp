import React, { useEffect, useState } from "react";
import MainHeader from "../components/MainHeader";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  useAddWorkoutMutation,
  useDeleteWorkoutMutation,
  useGetApiKeyQuery,
  useGetWorkoutsQuery,
} from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link } from "react-router-dom";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Button as MuiButton,
} from "@mui/material";
import axios from "axios";
import { setCredentials } from "../slices/authSlice";

const MainScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [exercise, setExercise] = useState(null);
  const [aWorkout, setAWorkout] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const dispatch = useDispatch();

  const {
    data: workouts,
    isLoading: loadingGetWorkouts,
    error,
    refetch,
  } = useGetWorkoutsQuery();

  const [addWorkout, { isLoading }] = useAddWorkoutMutation();
  const [deleteWorkout, { isLoading: loadingDeleteWorkout }] =
    useDeleteWorkoutMutation();

  const { data, isLoading: loadingApiKey } = useGetApiKeyQuery();

  const fetchExerciseData = async (apiKey) => {
    const config = {
      headers: {
        "X-Api-Key": apiKey,
      },
    };
    try {
      const response = await axios.get(
        `https://api.api-ninjas.com/v1/exercises`,
        config
      );
      const exercise = response.data[1];
      return exercise;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    refetch();
    const fetchData = async () => {
      if (!loadingApiKey && data && data.API_KEY) {
        const exerciseData = await fetchExerciseData(data.API_KEY);
        setExercise(exerciseData);
      }
    };
    fetchData();
  }, [refetch, loadingApiKey, data]);

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const workoutSubmitHandler = async (e) => {
    e.preventDefault();
    if (!aWorkout) {
      toast.error("Please enter a workout name");
    } else if (!selectedDay) {
      toast.error("Please select a day for your workout");
    } else {
      try {
        const res = await addWorkout({
          workoutName: aWorkout,
          workoutDay: selectedDay,
        });
        dispatch(setCredentials({ ...res.data }));
        refetch();
        setAWorkout("");
        setSelectedDay("");
        toast.success("Workout added successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const deleteWorkoutHandler = async (workoutId) => {
    if (window.confirm("Are you sure")) {
      try {
        const res = await deleteWorkout(workoutId);
        dispatch(setCredentials({ ...res.data }));
        refetch();
        toast.success("Workout successfully deleted");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div>
      <MainHeader />
      <Container className="mt-5">
        <Typography variant="h2" className="text-center">
          Welcome Back, {userInfo.firstName}
        </Typography>
        <Row>
          <Col md={6}>
            <Card
              style={{
                boxShadow: "0px 0px 8px black",
              }}
              className="my-2"
            >
              <Card.Body>
                <Typography variant="h5">Your Height</Typography>
                <Card.Subtitle>
                  <Typography variant="h3">
                    {userInfo && userInfo.height}"
                  </Typography>
                </Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card
              style={{
                boxShadow: "0px 0px 8px black",
              }}
              className="my-2"
            >
              <Card.Body>
                <Typography variant="h5">Your Weight</Typography>
                <Card.Subtitle>
                  <Typography variant="h3">
                    {userInfo && userInfo.weight} lbs
                  </Typography>
                </Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card
              style={{
                boxShadow: "0px 0px 8px black",
              }}
              className="mt-2 mb-2"
            >
              <Card.Body>
                <Typography className="text-center mb-1" variant="h6">
                  Workout Of The Day
                </Typography>

                {loadingApiKey && <Loader />}

                <Card.Subtitle>
                  <h1 className="text-center ">{exercise && exercise.name}</h1>
                </Card.Subtitle>
                <Typography variant="subtitle1" className="text-center">
                  {exercise && exercise.instructions}
                </Typography>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Card
              className="p-2 mt-2 mb-3"
              style={{ boxShadow: "0px 0px 8px black" }}
            >
              {workouts && workouts.length === 0 ? (
                <Typography variant="h4" className="my-3">
                  Get your collection started!
                </Typography>
              ) : (
                <Typography variant="h4" className="my-3">
                  Add to your collection!
                </Typography>
              )}

              <Form onSubmit={workoutSubmitHandler}>
                <Row className="mb-3">
                  <Col xs={8}>
                    <Form.Control
                      type="text"
                      placeholder="Enter workout"
                      value={aWorkout}
                      onChange={(e) => setAWorkout(e.target.value)}
                    />
                  </Col>

                  {daysOfWeek.map((day) => (
                    <Form.Check
                      className="ms-2 mt-1"
                      key={day}
                      type="radio"
                      label={day}
                      name="day"
                      value={day}
                      checked={selectedDay === day}
                      onChange={handleDayChange}
                    />
                  ))}
                </Row>
                <Row>
                  <Col className="mb-2">
                    <MuiButton
                      variant="contained"
                      color="secondary"
                      disabled={!aWorkout && !selectedDay}
                      type="submit"
                    >
                      Add Workout
                    </MuiButton>
                  </Col>
                  {isLoading && <Loader />}
                </Row>
              </Form>
            </Card>
          </Col>
          <Col md={6}>
            <Card
              className="p-2 mt-2 mb-3"
              style={{ boxShadow: "0px 0px 8px black" }}
            >
              <Row>
                <Col>
                  <Typography variant="h4" className="my-3">
                    Your Friends
                  </Typography>
                </Col>
                <Col className="d-flex align-items-center justify-content-end">
                  <Link
                    className="btn btn-primary"
                    to={"/profile/addfriends?prev=/mainscreen"}
                  >
                    Add friends
                  </Link>
                </Col>
              </Row>

              <div style={{ maxHeight: "310px", overflowY: "auto" }}>
                <List>
                  {!userInfo.friends ? (
                    <Typography>No friends</Typography>
                  ) : (
                    userInfo.friends.map((friend) => (
                      <Link
                        key={friend.user}
                        style={{ textDecoration: "none", color: "black" }}
                        to={`/profile/friends/${friend.user}?prev=/mainscreen`}
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
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card
              className="p-2 mt-2 mb-3"
              style={{ boxShadow: "0px 0px 8px black" }}
            >
              <Typography variant="h4" className="text-center mt-1">
                Your Collection
              </Typography>
              {loadingGetWorkouts && <Loader></Loader>}
              {loadingDeleteWorkout && <Loader></Loader>}
              {error && <Message variant="danger">{error}</Message>}
              {workouts && (
                <>
                  {daysOfWeek.map((day) => {
                    const filteredWorkouts = workouts.filter(
                      (workout) =>
                        workout.day.toLowerCase() === day.toLowerCase()
                    );

                    return (
                      <Row key={day}>
                        {filteredWorkouts.length > 0 && (
                          <h2 className="text-dark mt-2">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </h2>
                        )}
                        {filteredWorkouts.map((workout) => (
                          <Col md={4} key={workout._id}>
                            <Card id={workout._id} className="hover-card">
                              <Link
                                to={`/users/workout/${workout._id}`}
                                style={{ textDecoration: "none" }}
                              >
                                <ListGroup variant="flush">
                                  <ListGroup.Item>
                                    <Row>
                                      <Col md={12}>
                                        <h3>
                                          {workout.name
                                            .charAt(0)
                                            .toUpperCase() +
                                            workout.name.slice(1)}
                                        </h3>
                                      </Col>
                                    </Row>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <Row>
                                      <Col md={1}>
                                        <i className="fa-solid fa-calendar-days"></i>
                                      </Col>
                                      <Col>
                                        {workout.day.charAt(0).toUpperCase() +
                                          workout.day.slice(1)}
                                      </Col>
                                    </Row>
                                  </ListGroup.Item>
                                  {workout.exercises.length > 0 && (
                                    <ListGroup.Item>
                                      <Row>
                                        <Col xs={4} md={4}>
                                          <h4>Exercises:</h4>
                                        </Col>

                                        <Col xs={5} md={5}>
                                          {workout.exercises.map((exercise) => (
                                            <p key={exercise._id}>
                                              {exercise.name}
                                            </p>
                                          ))}
                                        </Col>
                                        <Col xs={3} md={3}>
                                          {workout.exercises.map((exercise) => (
                                            <p key={exercise._id}>
                                              {exercise.sets} X {exercise.reps}
                                            </p>
                                          ))}
                                        </Col>
                                      </Row>
                                    </ListGroup.Item>
                                  )}
                                </ListGroup>
                              </Link>
                              <Button
                                className="btn-danger"
                                onClick={() =>
                                  deleteWorkoutHandler(workout._id)
                                }
                              >
                                <i className="fa-solid fa-trash"></i> Delete
                              </Button>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    );
                  })}
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainScreen;
