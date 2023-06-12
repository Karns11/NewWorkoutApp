import React from "react";
import MainHeader from "../components/MainHeader";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteFriendMutation,
  useGetFriendByIdQuery,
} from "../slices/usersApiSlice";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";
import { useDispatch } from "react-redux";

const FriendScreen = () => {
  const { friendId } = useParams();

  const dispatch = useDispatch();

  const { data: friend, isLoading, refetch } = useGetFriendByIdQuery(friendId);

  const [deleteFriend, { isLoading: loadingDeleteFriend }] =
    useDeleteFriendMutation();

  const navigate = useNavigate();

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Get the location object from React Router
  const location = useLocation();

  // Determine the previous page path
  const previousPagePath = new URLSearchParams(location.search).get("prev");

  const deleteFriendHandler = async () => {
    try {
      const res = await deleteFriend(friendId);
      dispatch(setCredentials({ ...res.data }));
      toast.success("Friend Successfully Deleted");
      navigate("/profile");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div>
      <MainHeader />
      <Link
        className="btn btn-light my-4 mx-5"
        to={previousPagePath || "/profile"}
      >
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <div className="d-flex justify-content-between">
            <h1>
              {friend && friend.firstName} {friend && friend.lastName}
            </h1>

            <Button
              onClick={deleteFriendHandler}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </div>

          {loadingDeleteFriend && <Loader />}

          <Row>
            <Col>
              <Card
                className="p-2 mt-2 mb-3"
                style={{ boxShadow: "0px 0px 8px black" }}
              >
                <h2 className="text-center mt-1">
                  {friend.firstName}'s Collection
                </h2>

                {friend.workouts && (
                  <>
                    {daysOfWeek.map((day) => {
                      const filteredWorkouts = friend.workouts.filter(
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
      )}
    </div>
  );
};

export default FriendScreen;
