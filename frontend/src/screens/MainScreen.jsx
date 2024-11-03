import React, { useCallback, useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Button as MuiButton,
  Skeleton,
  Modal,
  Box,
} from "@mui/material";
import axios from "axios";
import { setCredentials } from "../slices/authSlice";
import Footer from "../components/Footer";

const MainScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [exercise, setExercise] = useState(null);
  const [aWorkout, setAWorkout] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = (exercise) => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

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

  const muscleOptions = [
    "abdominals",
    "abductors",
    "adductors",
    "biceps",
    "calves",
    "chest",
    "forearms",
    "glutes",
    "hamstrings",
    "lats",
    "lower_back",
    "middle_back",
    "neck",
    "quadriceps",
    "traps",
    "triceps",
  ];

  const dateObject = new Date();
  const dayOfMonth = dateObject.getDate();

  const dayOfWeek = dateObject.getDay();

  const muscleIndex = (dayOfMonth - 1) % muscleOptions.length;
  const randomMuscle = muscleOptions[muscleIndex];

  const fetchExerciseData = useCallback(
    async (apiKey) => {
      const config = {
        headers: {
          "X-Api-Key": apiKey,
        },
      };
      try {
        const response = await axios.get(
          `https://api.api-ninjas.com/v1/exercises?muscle=${randomMuscle}`,
          config
        );
        const responseIndex = (dayOfMonth - 1) % response.data.length;

        const exercise = response.data[responseIndex];
        return exercise;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [dayOfMonth, randomMuscle]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!loadingApiKey && data && data.API_KEY) {
        const exerciseData = await fetchExerciseData(data.API_KEY);
        setExercise(exerciseData);
      }
    };

    fetchData();
    refetch();
  }, [loadingApiKey, data, refetch, fetchExerciseData]);

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
        // Get the user's current workouts for the selected day from the fetched data
        const currentUserWorkouts = workouts.filter(
          (workout) => workout.day === selectedDay
        );
        const workoutCount = currentUserWorkouts.length;

        // Check if the count is less than three
        if (workoutCount >= 3) {
          toast.error("Maximum of 3 workouts per day");
          return;
        }
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

  const handleEditButton = () => {
    navigate("/profile");
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

  const colors = [
    "#7A3E3E",
    "#468B97",
    "#EF6262",
    "#F3AA60",
    "#9681EB",
    "#FFA41B",
    "#FF90BB",
  ];

  return (
    <div>
      <MainHeader />
      <Container className="mt-5">
        <Typography variant="h2" className="text-center">
          Welcome Back, {userInfo.firstName}
        </Typography>
        <Row>
          <Col className="lg:hidden block">
            <Card
              style={{
                boxShadow: "0px 0px 8px black",
              }}
              className="my-2"
            >
              <Card.Body>
                <div className="flex justify-center">
                  <Typography variant="h5">Current Streak</Typography>
                </div>
                <div className="flex justify-center">
                  <Typography variant="p">
                    Complete a workout each day to build your streak
                  </Typography>
                </div>
                <div className="flex justify-center mt-2">
                  <div
                    className="flex justify-center mr-2 small-flame"
                    style={{ backgroundColor: "#000", borderRadius: "0.45rem" }}
                  >
                    <Typography variant="p" className="mx-1 text-white">
                      0
                    </Typography>
                    <div className="flex items-center mx-1">
                      <i
                        className="fa-solid fa-fire"
                        style={{ color: "orange" }}
                      ></i>
                    </div>
                  </div>
                  {daysOfWeek.map((day, ind) => {
                    return (
                      <div
                        key={ind}
                        className="flex items-center mx-2 small-days"
                        style={
                          ind + 1 === dayOfWeek
                            ? {
                                backgroundColor: "#000",
                                borderRadius: "3rem",
                                border: "3px solid #00df9a",
                              }
                            : {
                                backgroundColor: "#000",
                                borderRadius: "3rem",
                              }
                        }
                      >
                        <Typography variant="p" className="text-white">
                          {day.substring(0, 2)}
                        </Typography>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className="hidden lg:block">
            <Card
              style={{
                boxShadow: "0px 0px 8px black",
              }}
              className="my-2"
            >
              <Card.Body>
                <div className="flex justify-center">
                  <Typography variant="h4">Current Streak</Typography>
                </div>
                <div className="flex justify-center">
                  <Typography variant="p">
                    Complete a workout each day to build your streak
                  </Typography>
                </div>
                <div className="flex justify-center mt-2">
                  <div
                    className="flex justify-center p-2 mr-2"
                    style={{ backgroundColor: "#000", borderRadius: "0.45rem" }}
                  >
                    <Typography variant="h5" className="mx-1 text-white">
                      0
                    </Typography>
                    <div className="flex items-center mx-1">
                      <i
                        className="fa-solid fa-fire"
                        style={{ color: "orange" }}
                      ></i>
                    </div>
                  </div>
                  {daysOfWeek.map((day, ind) => {
                    return (
                      <div
                        key={ind}
                        className="flex items-center mx-2 px-4"
                        style={
                          ind + 1 === dayOfWeek
                            ? {
                                backgroundColor: "#000",
                                borderRadius: "3rem",
                                border: "3px solid #00df9a",
                              }
                            : {
                                backgroundColor: "#000",
                                borderRadius: "3rem",
                              }
                        }
                      >
                        <Typography variant="p" className="text-white">
                          {day.substring(0, 3)}
                        </Typography>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card
              style={{
                boxShadow: "0px 0px 8px black",
              }}
              className="my-2"
            >
              <Card.Body>
                <div className="flex justify-between">
                  <Typography variant="h5">Your Height</Typography>
                  <MuiButton onClick={handleEditButton}>Edit</MuiButton>
                </div>
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
                <div className="flex justify-between">
                  <Typography variant="h5">Your Weight</Typography>
                  <MuiButton onClick={handleEditButton}>Edit</MuiButton>
                </div>
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
            {loadingApiKey || !exercise ? (
              <Card
                className="d-flex flex-column justify-content-between py-5 px-4 mt-2 mb-2 skeleton-card"
                style={{ height: "12.9rem", boxShadow: "0px 0px 8px black" }}
              >
                <Skeleton variant="h6" />
                <Skeleton variant="h1" animation="wave" />
                <Skeleton variant="subtitle1" animation={false} />
              </Card>
            ) : (
              <Card
                style={{
                  boxShadow: "0px 0px 8px black",
                }}
                className="mt-2 mb-2"
              >
                <Card.Body>
                  <Typography className="text-center mb-1" variant="h6">
                    Exercise Of The Day
                  </Typography>

                  <Card.Subtitle>
                    <Typography variant="h3" className="text-center ">
                      {exercise && exercise.name}
                    </Typography>
                  </Card.Subtitle>
                  <Typography variant="subtitle1" className="text-center">
                    {exercise && exercise.instructions}
                  </Typography>
                  <div className="flex items-center justify-end pt-2">
                    <MuiButton
                      color="secondary"
                      onClick={() => handleOpen(exercise)}
                    >
                      Add exercise to collection
                    </MuiButton>
                  </div>
                </Card.Body>
              </Card>
            )}
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
            {/* <Card
              className="p-2 mt-2 mb-3"
              style={{ boxShadow: "0px 0px 8px black" }}
            > */}
            <Typography variant="h4" className="text-center mt-4 mb-2">
              Your Collection
            </Typography>
            {loadingGetWorkouts && <Loader></Loader>}
            {loadingDeleteWorkout && <Loader></Loader>}
            {error && <Message variant="danger">{error}</Message>}
            {workouts && (
              <>
                {daysOfWeek.map((day) => {
                  const filteredWorkouts = workouts.filter(
                    (workout) => workout.day.toLowerCase() === day.toLowerCase()
                  );

                  return (
                    <div key={day}>
                      <Row>
                        <div className="lg:flex">
                          {filteredWorkouts.length > 0 && (
                            <h2
                              className="text-dark sideways-text"
                              style={{
                                backgroundColor: `${
                                  colors[daysOfWeek.indexOf(day)]
                                }`,
                              }}
                            >
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </h2>
                          )}
                          {filteredWorkouts.map((workout) => (
                            <Col md={6} lg={4} key={workout._id}>
                              <Card
                                id={workout._id}
                                className="hover-card lg:mr-4"
                              >
                                <Link
                                  to={`/users/workout/${workout._id}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  <ListGroup variant="flush">
                                    <ListGroup.Item>
                                      <Row>
                                        <Col md={12}>
                                          <h3 className="text-center font-bold">
                                            {workout.name
                                              .charAt(0)
                                              .toUpperCase() +
                                              workout.name.slice(1)}
                                          </h3>
                                        </Col>
                                      </Row>
                                    </ListGroup.Item>
                                    {/* <ListGroup.Item>
                                      <Row>
                                        <Col xs={1}>
                                          <i className="fa-solid fa-calendar-days"></i>
                                        </Col>
                                        <Col>
                                          {workout.day.charAt(0).toUpperCase() +
                                            workout.day.slice(1)}
                                        </Col>
                                      </Row>
                                    </ListGroup.Item> */}
                                    {workout.exercises.length > 0 ? (
                                      <ListGroup.Item>
                                        <Row>
                                          {/* <Col xs={4} md={4}>
                                            <h4 className="exercises-title">
                                              Exercises:
                                            </h4>
                                          </Col> */}

                                          <Col xs={9} md={9}>
                                            {workout.exercises.map(
                                              (exercise) => (
                                                <p
                                                  className="font-bold"
                                                  key={exercise._id}
                                                >
                                                  {exercise.name
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    exercise.name.slice(1)}
                                                </p>
                                              )
                                            )}
                                          </Col>
                                          <Col xs={3} md={3}>
                                            {workout.exercises.map(
                                              (exercise) => (
                                                <p key={exercise._id}>
                                                  {exercise.sets} X{" "}
                                                  {exercise.reps}
                                                </p>
                                              )
                                            )}
                                          </Col>
                                        </Row>
                                      </ListGroup.Item>
                                    ) : (
                                      <ListGroup.Item>
                                        <Row>
                                          <p className="text-center">
                                            Click to explore and add exercises!
                                          </p>
                                        </Row>
                                      </ListGroup.Item>
                                    )}
                                  </ListGroup>
                                </Link>
                                <MuiButton
                                  className="border"
                                  color="error"
                                  onClick={() =>
                                    deleteWorkoutHandler(workout._id)
                                  }
                                >
                                  <i className="fa-solid fa-trash"></i> Delete
                                </MuiButton>
                              </Card>
                            </Col>
                          ))}
                        </div>
                      </Row>
                      <div className="border-gray border-1 my-4" />
                    </div>
                  );
                })}
              </>
            )}
            {/* </Card> */}
          </Col>
        </Row>
      </Container>
      <Footer />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className="modal-box"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // Adjust width based on screen size
            maxWidth: 800, // Set maximum width for larger screens
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            overflowY: "auto", // Add scrollable behavior
            maxHeight: "80vh", // Set maximum height for the modal content
          }}
        >
          <Typography variant="h4" className="text-center mt-1">
            Choose Workout
          </Typography>
          {loadingGetWorkouts && <Loader></Loader>}
          {loadingDeleteWorkout && <Loader></Loader>}
          {error && <Message variant="danger">{error}</Message>}
          {workouts && (
            <>
              {daysOfWeek.map((day) => {
                const filteredWorkouts = workouts.filter(
                  (workout) => workout.day.toLowerCase() === day.toLowerCase()
                );

                return (
                  <Row key={day}>
                    {filteredWorkouts.length > 0 && (
                      <h2 className="text-dark mt-2">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </h2>
                    )}
                    {filteredWorkouts.map((workout) => (
                      <Col key={workout._id}>
                        <Card id={workout._id} className="hover-card">
                          <Link
                            to={`/users/workout/${
                              workout._id
                            }?prev=workoutmodal&eod=${
                              exercise && exercise.name
                            }`}
                            style={{ textDecoration: "none" }}
                          >
                            <ListGroup variant="flush">
                              <ListGroup.Item>
                                <Row>
                                  <Col md={12}>
                                    <h3>
                                      {workout.name.charAt(0).toUpperCase() +
                                        workout.name.slice(1)}
                                    </h3>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <Row>
                                  <Col xs={1}>
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
                                      <h4 className="exercises-title">
                                        Exercises:
                                      </h4>
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
                            onClick={() => deleteWorkoutHandler(workout._id)}
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
        </Box>
      </Modal>
    </div>
  );
};

export default MainScreen;
