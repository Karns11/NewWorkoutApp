import React, { useState } from "react";
import MainHeader from "../components/MainHeader";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  useAddWorkoutMutation,
  useDeleteWorkoutMutation,
  useGetWorkoutsQuery,
} from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link } from "react-router-dom";

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

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const workoutSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await addWorkout({ workoutName: aWorkout, workoutDay: selectedDay });
      refetch();
      setAWorkout("");
      setSelectedDay("");
      toast.success("Workout added successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const deleteWorkoutHandler = async (workoutId) => {
    try {
      await deleteWorkout(workoutId);
      refetch();
      toast.success("Workout successfully deleted");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
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
      <Container className="my-5">
        <h1 className="text-center">Welcome Back, {userInfo.firstName}</h1>
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
          <Col>
            {workouts && workouts.length === 0 ? (
              <h2 className="my-3">Get your collection started!</h2>
            ) : (
              <h2 className="my-3">Add to your collection!</h2>
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
                  <Button type="submit">Add Workout</Button>
                </Col>
                {isLoading && <Loader />}
              </Row>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card
              className="p-2 mt-2"
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
                            <Card className="bg-dark mt-2" id={workout._id}>
                              <Link
                                to={`/users/workout/${workout._id}`}
                                style={{ textDecoration: "none" }}
                              >
                                <Card.Body>
                                  <Card.Title>
                                    <h2 className="text-light">
                                      {workout.name.charAt(0).toUpperCase() +
                                        workout.name.slice(1)}
                                    </h2>
                                  </Card.Title>
                                  <Card.Subtitle>
                                    <h6 className="text-light">
                                      <i className="fa-solid fa-calendar-days"></i>{" "}
                                      {workout.day.charAt(0).toUpperCase() +
                                        workout.day.slice(1)}
                                    </h6>
                                  </Card.Subtitle>

                                  <Card.Text>
                                    {workout.exercises.length > 0 ? (
                                      <Row>
                                        <Col>
                                          <p>
                                            {workout.exercises.map(
                                              (singleExercise, index) => (
                                                <span key={index}>
                                                  {singleExercise}
                                                  {index !==
                                                  workout.exercises.length - 1
                                                    ? ", "
                                                    : ""}
                                                </span>
                                              )
                                            )}
                                          </p>
                                        </Col>
                                      </Row>
                                    ) : (
                                      "*Add exercises*"
                                    )}
                                  </Card.Text>
                                </Card.Body>
                              </Link>
                              <Button
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
