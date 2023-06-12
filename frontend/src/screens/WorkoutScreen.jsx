import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import {
  useAddExerciseMutation,
  useDeleteExerciseMutation,
  useGetApiKeyQuery,
  useGetExercisesQuery,
  useGetWorkoutByIdQuery,
} from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import {
  Card as BootCard,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Message from "../components/Message";
import {
  CardActions,
  CardContent,
  Typography,
  Button as MuiButton,
  Box,
  Card,
  Modal,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import axios from "axios";

const WorkoutScreen = () => {
  const { id: workoutId } = useParams();

  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [exercises, setExercises] = useState([]);
  const [anExercise, setAnExercise] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = (exercise) => {
    setSelectedExercise(exercise);
    setAnExercise(exercise.name);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const { data, isLoading, error, refetch } = useGetExercisesQuery(workoutId);

  const { data: workout, isLoading: loadingGetWorkout } =
    useGetWorkoutByIdQuery(workoutId);

  const [addExerciseMutation, { isLoading: loadingAddExercise }] =
    useAddExerciseMutation();

  const [deleteExercise, { isLoading: loadingDeleteExercise }] =
    useDeleteExerciseMutation();

  const handleAddExercise = async (event) => {
    event.preventDefault();

    const exerciseData = {
      workoutId,
      name: anExercise,
      reps: Number(reps),
      sets: Number(sets),
    };

    try {
      await addExerciseMutation(exerciseData);
      refetch();
      toast.success("Exercise added successfully!");
      setAnExercise("");
      setReps("");
      setSets("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const deleteExerciseHandler = async (workoutId, exerciseId) => {
    const data = {
      workoutId,
      exerciseId,
    };

    try {
      await deleteExercise(data);
      refetch();
      toast.success("Exercise successfully deleted");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const { data: apiKeyData, isLoading: loadingApiKey } = useGetApiKeyQuery();
  const API_KEY = loadingApiKey ? "" : apiKeyData?.API_KEY;

  const handleSearch = (muscle) => {
    const config = {
      headers: {
        "X-Api-Key": API_KEY,
      },
    };

    axios
      .get(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, config)
      .then((res) => setExercises(res.data))
      .catch((err) => console.log(err));
  };

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

  return (
    <div className="workout-screen">
      <MainHeader />
      <Container>
        <Link className="btn btn-light mt-3" to="/mainscreen">
          Go Back
        </Link>
      </Container>

      <Container className="text-center">
        {error && <Message variant="danger">{error}</Message>}
        {loadingGetWorkout ? <Loader /> : <h1>Your {workout.name} workout</h1>}
        {!loadingGetWorkout && (
          <div className="d-flex justify-content-center align-items-center">
            <i className="fa-solid fa-calendar-days me-2"></i>
            <h2>
              {workout.day.charAt(0).toUpperCase() + workout.day.slice(1)}
            </h2>
          </div>
        )}

        <h3 className="mt-5">Exercises:</h3>
        {isLoading ? (
          <Loader />
        ) : (
          <Row className="d-flex justify-content-center align-items-center mv-5">
            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  {data.exercises.map((exercise) => (
                    <ListGroup.Item key={exercise._id}>
                      <Row>
                        <Col md={5}>{exercise.name}</Col>
                        <Col md={5}>
                          {exercise.sets} X {exercise.reps}
                        </Col>
                        <Col md={2}>
                          <i
                            onClick={() =>
                              deleteExerciseHandler(workoutId, exercise._id)
                            }
                            className="fa-solid fa-trash exercise-delete"
                          ></i>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        )}
        {loadingDeleteExercise && <Loader />}
        <Row className="d-flex justify-content-center align-items-center">
          <Col md={8}>
            <Card className="mt-5 pb-5">
              <Row className="d-flex justify-content-center align-items-start mt-5">
                <Col md={4}>
                  <h3>Add an exercise</h3>
                  <Form onSubmit={handleAddExercise}>
                    <Form.Group controlId="exerciseName" className="my-3">
                      <Form.Label>Exercise Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter exercise"
                        value={anExercise}
                        onChange={(e) => setAnExercise(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="sets" className="my-3">
                      <Form.Label>Sets</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter sets"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="reps" className="my-3">
                      <Form.Label>Reps</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter reps"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                      />
                    </Form.Group>
                    <MuiButton
                      variant="contained"
                      color="secondary"
                      type="submit"
                    >
                      Add Exercise
                    </MuiButton>
                    {loadingAddExercise && <Loader />}
                  </Form>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <BootCard
          style={{ boxShadow: "0px 0px 8px black" }}
          className="mt-5 p-2"
        >
          <Typography className="text-center" variant="h2">
            Search Exercises
          </Typography>
          <Container className="mt-5 d-flex justify-content-center">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {muscleOptions.map((muscle) => (
                <div key={muscle} style={{ flexBasis: "12.5%" }}>
                  <input
                    type="radio"
                    id={muscle}
                    name="muscle"
                    value={muscle}
                    checked={selectedMuscle === muscle}
                    onChange={(e) => setSelectedMuscle(e.target.value)}
                  />
                  {muscle.includes("_") ? (
                    <label htmlFor={muscle}>{muscle.replace(/_/g, " ")}</label>
                  ) : (
                    <label htmlFor={muscle}>{muscle}</label>
                  )}
                </div>
              ))}
            </div>
          </Container>
          <Container className="d-flex justify-content-center">
            <MuiButton
              onClick={() => handleSearch(selectedMuscle)}
              variant="contained"
              color="primary"
            >
              Search
            </MuiButton>
          </Container>
        </BootCard>
      </Container>

      <Container className="mt-5">
        {exercises &&
          exercises.map((exercise, ind) => (
            <Box
              component="span"
              sx={{
                mx: "2px",
                transform: "scale(0.8)",
              }}
              key={ind}
            >
              <Card style={{ maxWidth: "400px" }} variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="div">
                    {exercise.name}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {exercise.muscle.includes("_")
                      ? exercise.muscle.replace(/_/g, " ")
                      : exercise.muscle}
                  </Typography>
                  <Typography variant="body2">
                    {"-"}{" "}
                    {exercise.instructions.length > 100
                      ? exercise.instructions.substring(0, 150) + "..."
                      : exercise.instructions}
                  </Typography>
                </CardContent>
                <CardActions>
                  <MuiButton
                    onClick={() => handleOpen(exercise)}
                    color="secondary"
                    variant="contained"
                    size="small"
                  >
                    Add Exercise
                  </MuiButton>
                </CardActions>
              </Card>
            </Box>
          ))}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMediumScreen ? 800 : "90%", // Adjust width based on screen size
              maxWidth: 800, // Set maximum width for larger screens
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {selectedExercise && selectedExercise.name}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {selectedExercise && selectedExercise.instructions}
            </Typography>
            <Form onSubmit={handleAddExercise}>
              <Form.Group controlId="exerciseName" className="my-3">
                <Form.Label>Exercise Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter exercise"
                  value={anExercise}
                  onChange={(e) => setAnExercise(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="sets" className="my-3">
                <Form.Label>Sets</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter sets"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="reps" className="my-3">
                <Form.Label>Reps</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter reps"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                />
              </Form.Group>
              <MuiButton variant="contained" color="secondary" type="submit">
                Add Exercise
              </MuiButton>
              {loadingAddExercise && <Loader />}
            </Form>
          </Box>
        </Modal>
      </Container>
    </div>
  );
};

export default WorkoutScreen;
