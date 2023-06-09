import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const exerciseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
    default: 0,
  },
  reps: {
    type: Number,
    required: true,
    default: 0,
  },
});

const workoutSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  exercises: [exerciseSchema],
});

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 0,
    },
    workouts: [workoutSchema],
    friends: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          firstName: {
            type: String,
            required: true,
          },
          lastName: {
            type: String,
            required: true,
          },
          workouts: [workoutSchema],
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

//ALLOWS US TO USE THE METHOD MATCHPASSWORD WHEN SUTHENTICATING A USER
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//ALLOWS US TO ENCRYPT THE PASSWORD BEFORE SAVING IT INTO THE DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
