import React, { useState } from "react";
import MainHeader from "../components/MainHeader";
import {
  useAddFriendMutation,
  useGetUserProfileQuery,
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
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";

const AddFriendsScreen = () => {
  const dispatch = useDispatch();
  const {
    data: users,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useGetUsersQuery();

  const { userInfo } = useSelector((state) => state.auth);

  const [addFriend, { isLoading: loadingAddFriend }] = useAddFriendMutation();

  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useGetUserProfileQuery();

  const handleAddFriendClick = async (userId) => {
    try {
      const res = await addFriend(userId);
      dispatch(setCredentials({ ...res.data }));
      toast.success("Successfully added friend");
      refetchProfile();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Get the location object from React Router
  const location = useLocation();

  // Determine the previous page path
  const previousPagePath = new URLSearchParams(location.search).get("prev");

  if (isLoadingUsers || isLoadingProfile) {
    return (
      <div>
        <MainHeader />
        <Link
          className="btn btn-light my-4 mx-5"
          to={previousPagePath || "/profile"}
        >
          Go Back
        </Link>
        <Container className="mt-4 mb-2">
          <Loader />
        </Container>
      </div>
    );
  }

  if (usersError) {
    return (
      <div>
        <MainHeader />
        <Link
          className="btn btn-light my-4 mx-5"
          to={previousPagePath || "/profile"}
        >
          Go Back
        </Link>
        <Container className="mt-4 mb-2">
          <Message variant="danger">{usersError}</Message>
        </Container>
      </div>
    );
  }

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`;
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      <MainHeader />
      <Link
        className="btn btn-light my-4 mx-5"
        to={previousPagePath || "/profile"}
      >
        Go Back
      </Link>
      <Container className="mt-4 mb-2">
        <SearchBox onSearch={handleSearch} />
        {loadingAddFriend && <Loader />}
        <Typography variant="h3">Users</Typography>
        <List>
          {filteredUsers.map((user) => {
            const isFriend = userProfile.friends.some(
              (friend) => friend.user === user._id
            );

            if (userInfo._id !== user._id && !isFriend) {
              return (
                <div key={user._id}>
                  <ListItem alignItems="flex-start">
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to={`/profile/friends/${user._id}?prev=/profile/addfriends`}
                    >
                      <ListItemAvatar>
                        <Avatar alt={user.firstName} src="" />
                      </ListItemAvatar>
                    </Link>
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to={`/profile/friends/${user._id}?prev=/profile/addfriends`}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            sx={{ fontWeight: "bold" }}
                            variant="body1"
                          >
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
                    </Link>
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
              );
            }
            return null; // Render nothing if ids match
          })}
        </List>
        {isLoadingProfile && <Loader />}
      </Container>
    </div>
  );
};

export default AddFriendsScreen;
