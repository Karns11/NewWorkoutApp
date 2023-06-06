import React, { useEffect, useState } from "react";
import MainHeader from "../components/MainHeader";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";

const MainScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [workoutOfDay, setWorkoutOfDay] = useState({});

  const API_KEY = "a8QKtCXDr+YhDzCuEze3sg==92yRGYcjvYNszt5X";

  useEffect(() => {
    axios
      .get("https://api.api-ninjas.com/v1/exercises?muscle=biceps", {
        headers: { "X-Api-Key": API_KEY },
      })
      .then((res) => setWorkoutOfDay(res))
      .catch((err) => console.log(err));
  }, [workoutOfDay]);

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
                  <h1>{userInfo.height}"</h1>
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
                  <h1>{userInfo.weight} lbs</h1>
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
      </Container>
    </div>
  );
};

export default MainScreen;
