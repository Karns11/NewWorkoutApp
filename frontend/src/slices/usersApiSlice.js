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
      invalidatesTags: ["User"],
    }),
    getUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}`,
      }),
    }),
    addFriend: builder.mutation({
      query: (friendId) => ({
        url: `${USERS_URL}/friends/${friendId}`,
        method: "POST",
      }),
    }),
    getFriendById: builder.query({
      query: (friendId) => ({
        url: `${USERS_URL}/friends/${friendId}`,
      }),
    }),
    deleteFriend: builder.mutation({
      query: (friendId) => ({
        url: `${USERS_URL}/friends/${friendId}`,
        method: "DELETE",
      }),
    }),
    addToNewsletter: builder.mutation({
      query: (email) => ({
        url: `${USERS_URL}/newsletter`,
        method: "POST",
        body: email,
      }),
    }),
    getApiKey: builder.query({
      query: () => ({
        url: `${USERS_URL}/api-key`,
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
  useGetUsersQuery,
  useAddFriendMutation,
  useGetFriendByIdQuery,
  useDeleteFriendMutation,
  useAddToNewsletterMutation,
  useGetApiKeyQuery,
} = usersApiSlice;
