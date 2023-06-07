import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";

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
    email: req.user.email,
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

    return res
      .status(200)
      .json({ message: "Workout deleted successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  addWorkout,
  getWorkouts,
  deleteWorkout,
};
