import React from "react";
import MainHeader from "../components/MainHeader";
import {
  useAddFriendMutation,
  useGetUsersQuery,
} from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import { Container } from "react-bootstrap";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import SearchBox from "../components/SearchBox";
import { ListItemSecondaryAction } from "@mui/material";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import Message from "../components/Message";
import { Link } from "react-router-dom";

const AddFriendsScreen = () => {
  const { data: users, isLoading, refetch, error } = useGetUsersQuery();

  const [addFriend, { isLoading: loadingAddFriend }] = useAddFriendMutation();

  const handleAddFriendClick = async (userId) => {
    try {
      await addFriend(userId);
      toast.success("Successfully added friend");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div>
      <MainHeader />
      <Link className="btn btn-light my-4 mx-5" to="/profile">
        Go Back
      </Link>
      <Container className="mt-4 mb-2">
        <SearchBox />
        {loadingAddFriend && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        <List>
          {isLoading ? (
            <Loader />
          ) : (
            users.map((user) => (
              <div key={user._id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={user.firstName} src="" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: "bold" }} variant="body1">
                        {user.firstName + " " + user.lastName}
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
                          {user.workouts.length} workouts
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      onClick={() => handleAddFriendClick(user._id)}
                      color="primary"
                    >
                      Add
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            ))
          )}
        </List>
      </Container>
    </div>
  );
};

export default AddFriendsScreen;
