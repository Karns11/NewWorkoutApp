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
} = usersApiSlice;
