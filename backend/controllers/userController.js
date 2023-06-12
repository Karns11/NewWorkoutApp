import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// @desc   Auth user/set token
//route    POST /api/users/auth
//@access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      height: user.height,
      weight: user.weight,
      workouts: user.workouts,
      friends: user.friends,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc   Register a new user
//route    POST /api/users
//@access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, height, weight, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    height,
    weight,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      height: user.height,
      weight: user.weight,
      workouts: user.workouts,
      friends: user.friends,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc   Logout user
//route    POST /api/users/logout
//@access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out" });
});

// @desc   Get user profile
//route    GET /api/users/profile
//@access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // If we were to console.log(req.user), then we would get _id, anme, email, createdat, updatedat, __v

  const user = {
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    height: req.user.height,
    weight: req.user.weight,
    email: req.user.email,
    friends: req.user.friends,
  };
  res.status(200).json(user);
});

// @desc   Update user profile
//route    PUT /api/users/profile
//@access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.height = req.body.height || user.height;
    user.weight = req.body.weight || user.weight;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      height: updatedUser.height,
      weight: updatedUser.weight,
      workouts: updatedUser.workouts,
      friends: updatedUser.friends,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc   Get users workouts
//route    GET /api/users/workouts
//@access  Private
const getWorkouts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  try {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const workouts = user.workouts;
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc   Get workout by id
//route    GET /api/users/workouts/:id
//@access  Private
const getWorkout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  try {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const workouts = user.workouts;

    const workout = workouts.find(
      (workout) => workout._id.toString() === req.params.id
    );
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc   Add workout
//route    POST /api/users/workouts
//@access  Private
const addWorkout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { workoutName, workoutDay } = req.body;

  try {
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const newWorkout = {
      name: workoutName,
      day: workoutDay,
      exercises: [],
    };

    user.workouts.push(newWorkout);
    await user.save();

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastname,
      height: user.height,
      weight: user.weight,
      friends: user.friends,
      workouts: user.workouts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc Delete a workout
// @route DELETE /api/users/workout/:id
// @access Private
const deleteWorkout = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Assuming the authenticated user's ID is available in req.user._id
    const workoutId = req.params.id; // ID of the workout to be deleted

    // Find the user by ID and update the workouts array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { workouts: { _id: workoutId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastname,
      height: user.height,
      weight: user.weight,
      friends: user.friends,
      workouts: user.workouts,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// @desc Add an exercise
// @route POST /api/users/workout/:id/exercise
// @access Private
const addExercise = asyncHandler(async (req, res) => {
  try {
    const { name, reps, sets } = req.body;

    // Find the user by userId
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const workouts = user.workouts;

    const workout = workouts.find(
      (workout) => workout._id.toString() === req.params.id
    );

    if (!workout) {
      res.status(404);
      throw new Error("Workout not found");
    }

    // Create a new exercise and add it to the workout
    const newExercise = {
      name,
      reps,
      sets,
    };

    workout.exercises.push(newExercise);

    await user.save();

    res.status(200).json({
      workout,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc Get Exercises for a workout
// @route GET /api/users/workout/:id/exercise
// @access Private
const getExercises = asyncHandler(async (req, res) => {
  try {
    // Find the user by userId
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const workouts = user.workouts;

    const workout = workouts.find(
      (workout) => workout._id.toString() === req.params.id
    );

    if (!workout) {
      res.status(404);
      throw new Error("Workout not found");
    }

    res.status(200).json({
      exercises: workout.exercises,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc Delete an exercise
// @route DELETE /api/users/workout/:workoutId/exercise/exerciseId
// @access Private
const deleteExercise = asyncHandler(async (req, res) => {
  try {
    // Find the user by userId
    const user = await User.findById(req.user._id);
    const { workoutId, exerciseId } = req.params;

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const workout = user.workouts.id(workoutId);

    if (!workout) {
      res.status(404);
      throw new Error("Workout not found");
    }

    // Find the index of the exercise within the exercises array
    const exerciseIndex = workout.exercises.findIndex(
      (exercise) => exercise._id.toString() === exerciseId
    );

    if (exerciseIndex === -1) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    // Remove the exercise from the exercises array using splice
    workout.exercises.splice(exerciseIndex, 1);

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: "Exercise deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc Add a friend
// @route POST /api/users/friends/:friendId
// @access Private
const addFriend = asyncHandler(async (req, res) => {
  const { friendId } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Check if the users are already friends
    const isUserFriend = user.friends.some(
      (friend) => friend.user.toString() === friendId
    );
    const isFriendFriend = friend.friends.some(
      (friend) => friend.user.toString() === userId
    );
    if (isUserFriend || isFriendFriend) {
      res.status(400);
      throw new Error("Already friends");
    }

    // Add the friend to the user's friends list
    user.friends.push({
      user: friendId,
      firstName: friend.firstName,
      lastName: friend.lastName,
      workouts: friend.workouts,
    });
    await user.save();

    // Add the user to the friend's friends list
    friend.friends.push({
      user: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      workouts: user.workouts,
    });
    await friend.save();

    return res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      height: user.height,
      weight: user.weight,
      workouts: user.workouts,
      friends: user.friends,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// @desc Get users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc Get friend by Id
// @route GET /api/users/friends/:friendId
// @access Private
const getFriendById = asyncHandler(async (req, res) => {
  const { friendId } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friend = await User.findById(friendId).select("-friends");
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    res.status(200).json(friend);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// @desc Delete friend
// @route GET /api/users/friends/:friendId
// @access Private
const deleteFriend = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Assuming the user ID is provided as a URL parameter
    const friendId = req.params.friendId; // Assuming the friend ID is provided as a URL parameter

    // Find the friend by ID
    const friend = await User.findById(friendId);

    // Check if the friend exists
    if (!friend) {
      return res.status(404).json({ error: "Friend not found" });
    }

    // Find the user by ID in the friend's friends array
    const userIndex = friend.friends.findIndex(
      (friend) => friend.user.toString() === userId.toString()
    );

    // Check if the user exists in the friend's friends array
    if (userIndex !== -1) {
      // Remove the user from the friend's friends array
      friend.friends.splice(userIndex, 1);

      // Save the updated friend
      await friend.save();
    }

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the friend by ID in the user's friends array
    const friendIndex = user.friends.findIndex(
      (friend) => friend.user.toString() === friendId
    );

    // Check if the friend exists
    if (friendIndex === -1) {
      return res.status(404).json({ error: "Friend not found" });
    }

    // Remove the friend from the friends array
    user.friends.splice(friendIndex, 1);

    // Save the updated user
    await user.save();

    return res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      height: user.height,
      weight: user.weight,
      workouts: user.workouts,
      friends: user.friends,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @desc Signup for newsletter
// @route POST /api/users/newsletter
// @access Public
const newsletterSignup = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
      },
    ],
  };
  try {
    const response = await axios.post(
      "https://us14.api.mailchimp.com/3.0/lists/e7b4c3c7ab",
      data,
      {
        auth: {
          username: "nathan1",
          password: process.env.MAILCHIMP_PASSWORD,
        },
      }
    );

    if (response.status === 200) {
      res.json({ message: "added successfully" });
    } else {
      res.json({ message: "Could not add to newsletter" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Server error" });
  }
});

// @desc Get API_KEY
// @route Get /api/users/api-key
// @access Private
const getApiKey = asyncHandler(async (req, res) => {
  const API_KEY = process.env.API_KEY;
  res.json({ API_KEY });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getWorkout,
  addWorkout,
  getWorkouts,
  deleteWorkout,
  addExercise,
  getExercises,
  deleteExercise,
  addFriend,
  getUsers,
  getFriendById,
  deleteFriend,
  newsletterSignup,
  getApiKey,
};
