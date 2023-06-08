import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

//mutation means it is NOT going to make a get request
//this is for the server stuff
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    addWorkout: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/workouts`,
        method: "POST",
        body: data,
      }),
    }),
    getWorkouts: builder.query({
      query: () => ({
        url: `${USERS_URL}/workouts`,
      }),
    }),
    deleteWorkout: builder.mutation({
      query: (workoutId) => ({
        url: `${USERS_URL}/workout/${workoutId}`,
        method: "DELETE",
      }),
    }),
    getExercises: builder.query({
      query: (workoutId) => ({
        url: `${USERS_URL}/workout/${workoutId}/exercise`,
      }),
    }),
    getWorkoutById: builder.query({
      query: (workoutId) => ({
        url: `${USERS_URL}/workout/${workoutId}`,
      }),
    }),
    addExercise: builder.mutation({
      query: (exerciseData) => ({
        url: `${USERS_URL}/workout/${exerciseData.workoutId}/exercise`,
        method: "POST",
        body: exerciseData,
      }),
    }),
    deleteExercise: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/workout/${data.workoutId}/exercise/${data.exerciseId}`,
        method: "DELETE",
      }),
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useAddWorkoutMutation,
  useGetWorkoutsQuery,
  useDeleteWorkoutMutation,
  useGetExercisesQuery,
  useGetWorkoutByIdQuery,
  useAddExerciseMutation,
  useDeleteExerciseMutation,
  useGetUserProfileQuery,
} = usersApiSlice;
