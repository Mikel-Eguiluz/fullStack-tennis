import React, { createContext, useState, useCallback } from "react";
import { useToasts } from "react-toast-notifications";
// import { useAuth0 } from "@auth0/auth0-react";
import moment from "moment";
let headers = {
  "Content-Type": "application/json",
  // 'Content-Type': 'application/x-www-form-urlencoded',
};
export const BookingsContext = createContext({
  fetchBookings: () => [],
  // fetchUpcomingBookingsByUserID: () => [],
  addBooking: () => {},
  deleteBooking: () => {},
  loaded: false,
  loading: false,
  error: null,
  bookings: [],
  userUpcomingBookings: [],
});

export const BookingsProvider = (props) => {
  const [state, setState] = useState({
    loading: false,
    loaded: false,
    error: null,
    bookings: [],
    userUpcomingBookings: [],
  });
  const { loading, error, bookings, loaded } = state;
  const setLoading = useCallback(
    () =>
      setState({
        ...state,
        loading: true,
      }),
    [state],
  );

  const setBookings = useCallback(
    (data) =>
      setState({
        ...state,
        bookings: data,
        loading: false,
        loaded: true,
      }),
    [state],
  );
  // const setUserUpcomingBookings = useCallback(
  //   (data) =>
  //     setState({
  //       ...state,
  //       userUpcomingBookings: data,
  //       loading: false,
  //       loaded: true,
  //     }),
  //   [state],
  // );

  const setError = useCallback(
    (err) =>
      setState({
        ...state,
        error: err.message || err.statusText,
        loading: false,
        loaded: true,
      }),
    [state],
  );

  const { addToast } = useToasts();

  const fetchBookings = useCallback(async () => {
    const { loading, loaded, error } = state;
    if (loading || loaded || error) {
      return;
    }
    setLoading();
    try {
      const response = await fetch("/api/v1/bookings", {
        headers: headers,
      });
      if (!response.ok) {
        throw response;
      }
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.log("err", err);
      setError(err);
    }
  }, [setError, setLoading, setBookings, state]);

  // const { user } = useAuth0();
  // const fetchUpcomingBookingsByUserID = useCallback(async () => {
  //   console.log(user);
  //   const { loading, loaded, error } = state;
  //   if (loading || loaded || error) {
  //     return;
  //   }
  //   setLoading();
  //   try {
  //     console.log("/api/v1/bookings/" + user.sub);
  //     const response = await fetch("/api/v1/bookings/" + user.sub, {
  //       headers: headers,
  //     });
  //     if (!response.ok) {
  //       throw response;
  //     }
  //     const data = await response.json();
  //     console.log(data);
  //     setUserUpcomingBookings(data);
  //   } catch (err) {
  //     console.log("err", err);
  //     setError(err);
  //   }
  // }, [setError, setLoading, setUserUpcomingBookings, state, user]);

  const addBooking = useCallback(
    async (bookingData) => {
      setLoading();
      const { bookings } = state;
      try {
        const response = await fetch("/api/v1/bookings", {
          method: "POST",
          headers: headers,
          body: JSON.stringify(bookingData),
        });
        if (response.status !== 201) {
          throw response;
        }
        const savedBooking = await response.json();
        addToast(`Saved ${savedBooking.startDateTime}`, {
          appearance: "success",
        });
        console.log("got data", savedBooking);
        setBookings([...bookings, savedBooking]);
        console.log("bookings after save", bookings);
        addToast(
          `Saved ${
            moment(savedBooking.startDateTime).format("dddd Do MMM , h:mm a") +
            "  " +
            savedBooking.court
          } `,
          {
            appearance: "success",
          },
        );
      } catch (err) {
        console.log(err);
        setState(err);
        addToast(`Error ${err.message || err.statusText}`, {
          appearance: "error",
        });
      }
    },
    [addToast, setLoading, setBookings, state],
  );
  const deleteBooking = useCallback(
    async (id) => {
      let deletedBooking = null;
      setLoading();
      const { bookings } = state;
      try {
        const response = await fetch(`/api/v1/bookings/${id}`, {
          method: "DELETE",
          headers: headers,
        });
        if (response.status !== 204) {
          throw response;
        }
        // Get index
        const index = bookings.findIndex((booking) => booking._id === id);
        deletedBooking = bookings[index];
        // recreate the bookings array without that booking
        const updatedBookings = [
          ...bookings.slice(0, index),
          ...bookings.slice(index + 1),
        ];
        setBookings(updatedBookings);
        addToast(
          `Deleted ${
            moment(deletedBooking.startDateTime).format(
              "dddd Do MMM , h:mm a",
            ) +
            "  " +
            deletedBooking.court
          }`,
          {
            appearance: "success",
          },
        );
      } catch (err) {
        console.log(err);
        setError(err);
        addToast(`Error: Failed to update ${deletedBooking.title}`, {
          appearance: "error",
        });
      }
    },
    [addToast, setError, setLoading, setBookings, state],
  );

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        // userUpcomingBookings,
        loading,
        error,
        loaded,
        fetchBookings,
        // fetchUpcomingBookingsByUserID,
        addBooking,
        deleteBooking,
      }}
    >
      {props.children}
    </BookingsContext.Provider>
  );
};
