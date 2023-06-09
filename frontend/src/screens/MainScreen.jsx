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
import { useSelector } from "react-redux";
import {
  useAddWorkoutMutation,
  useDeleteWorkoutMutation,
  useGetUserProfileQuery,
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
} from "@mui/material";

const MainScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [aWorkout, setAWorkout] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const {
    data: workouts,
    isLoading: loadingGetWorkouts,
    error,
    refetch,
  } = useGetWorkoutsQuery();

  const [addWorkout, { isLoading }] = useAddWorkoutMutation();
  const [deleteWorkout, { isLoading: loadingDeleteWorkout }] =
    useDeleteWorkoutMutation();

  const { data: userProfile, isLoading: loadingGetProfile } =
    useGetUserProfileQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

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
        await addWorkout({ workoutName: aWorkout, workoutDay: selectedDay });
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
        await deleteWorkout(workoutId);
        refetch();
        toast.success("Workout successfully deleted");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
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
                <Card.Title>Your Height</Card.Title>
                <Card.Subtitle>
                  <h1>{userInfo && userInfo.height}"</h1>
                </Card.Subtitle>
                {/* <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text> */}
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
                <Card.Title>Your Weight</Card.Title>
                <Card.Subtitle>
                  <h1>{userInfo && userInfo.weight} lbs</h1>
                </Card.Subtitle>
                {/* <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text> */}
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
              className="mt-2 mb-5"
            >
              <Card.Body>
                <Card.Title className=" text-center">
                  Workout of the day
                </Card.Title>
                <Card.Subtitle>
                  <h1 className="text-center ">Incline Hammer Curls</h1>
                </Card.Subtitle>
                <Card.Text className="text-center">
                  Seat yourself on an incline bench with a dumbbell in each
                  hand. You should pressed firmly against he back with your feet
                  together. Allow the dumbbells to hang straight down at your
                  side, holding them with a neutral grip. This will be your
                  starting position. Initiate the movement by flexing at the
                  elbow, attempting to keep the upper arm stationary. Continue
                  to the top of the movement and pause, then slowly return to
                  the start position.
                </Card.Text>
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
                    <Button
                      className="btn-dark"
                      disabled={!aWorkout && !selectedDay}
                      type="submit"
                    >
                      Add Workout
                    </Button>
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
                  {loadingGetProfile ? (
                    <Loader />
                  ) : (
                    userProfile.friends.map((friend) => (
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
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    sx={{ display: "inline" }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {friend.workouts.length} workouts
                                  </Typography>
                                </React.Fragment>
                              }
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
              <h2 className="text-center mt-1">Your Collection</h2>
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
