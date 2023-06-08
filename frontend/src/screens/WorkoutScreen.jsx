import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import {
  useAddExerciseMutation,
  useDeleteExerciseMutation,
  useGetExercisesQuery,
  useGetWorkoutByIdQuery,
} from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import { toast } from "react-toastify";

const WorkoutScreen = () => {
  const { id: workoutId } = useParams();

  const [anExercise, setAnExercise] = useState("");
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(0);

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
      setReps(0);
      setSets(0);
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

  return (
    <div>
      <MainHeader />
      <Container>
        <Link className="btn btn-light mt-3" to="/mainscreen">
          Go Back
        </Link>
      </Container>

      <Container className="text-center">
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
                    <Button type="submit">Add Exercise</Button>
                  </Form>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WorkoutScreen;
