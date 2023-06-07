import React from "react";
import { Link, useParams } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import {
  useGetExercisesQuery,
  useGetWorkoutByIdQuery,
} from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import { Container } from "react-bootstrap";

const WorkoutScreen = () => {
  const { id: workoutId } = useParams();

  const { data, isLoading, error, refetch } = useGetExercisesQuery(workoutId);

  const { data: workout, isLoading: loadingGetWorkout } =
    useGetWorkoutByIdQuery(workoutId);

  console.log(workout);

  return (
    <div>
      <MainHeader />
      <Container>
        <Link className="btn btn-light mt-3" to="/mainscreen">
          Go Back
        </Link>
      </Container>

      <Container className="text-center">
        {loadingGetWorkout ? <Loader /> : <h1>{workout.name} workout</h1>}

        <h2 className="mt-5">Exercises:</h2>
        {isLoading ? (
          <Loader />
        ) : (
          data.exercises.map((exercise) => (
            <li key={exercise._id}>{exercise.name}</li>
          ))
        )}
      </Container>
    </div>
  );
};

export default WorkoutScreen;
