import React, { useState } from "react";
import MainHeader from "../components/MainHeader";
import axios from "axios";
import { Button, Container, Card as BootCard } from "react-bootstrap";
import {
  CardActions,
  CardContent,
  Typography,
  Button as MuiButton,
  Box,
  Card,
} from "@mui/material";
import { useGetApiKeyQuery } from "../slices/usersApiSlice";

const AddWorkoutsScreen = () => {
  const { data, isLoading: loadingApiKey } = useGetApiKeyQuery();
  const API_KEY = loadingApiKey ? "" : data?.API_KEY;
  console.log(API_KEY);

  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [exercises, setExercises] = useState([]);

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
    <div>
      <MainHeader />
      <Container>
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
                  <Button size="small">Add exercise to workout</Button>
                </CardActions>
              </Card>
            </Box>
          ))}
      </Container>
    </div>
  );
};

export default AddWorkoutsScreen;
