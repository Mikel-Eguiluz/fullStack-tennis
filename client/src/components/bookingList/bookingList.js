import React, { useContext, useEffect } from "react";
import { BookingsContext } from "../../contexts/bookings.context";

import moment from "moment";

import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  Container,
  Box,
  IconButton,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";

import AccessTimeIcon from "@material-ui/icons/AccessTime";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import { useAuth0 } from "@auth0/auth0-react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #000000",
  },
  // largeIcon: {
  //   height: "100%",
  // },
}));
export default function BookingsList() {
  const { user, isAuthenticated } = useAuth0();
  const {
    bookings,
    loaded,
    loading,
    error,
    fetchBookings,
    deleteBooking,
  } = useContext(BookingsContext);
  const classes = useStyles();
  useEffect(() => {
    // console.log("in useEffect", userUpcomingBookings, loaded, loading);
    if (!loading && !loaded) {
      fetchBookings();

      console.log("in useEffect book", bookings, loaded, loading);
    }
  }, [loaded, fetchBookings, bookings, loading]);

  if (loading || !isAuthenticated) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container maxWidth="md">
      <List>
        {bookings.length ? (
          bookings.map(
            (booking) =>
              user.sub === booking.userId && (
                <ListItem key={booking._id} className={classes.root}>
                  <Box>
                    <ListItemAvatar>
                      <Avatar>
                        <AccessTimeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={moment(booking.startDateTime).format(
                        "dddd Do MMM , h:mm a",
                      )}
                      secondary={booking.court}
                    />
                  </Box>
                  <Box>
                    <IconButton
                      aria-label="delete"
                      onClick={() => deleteBooking(booking._id)}
                    >
                      <DeleteForeverIcon fontSize="large" />
                    </IconButton>
                  </Box>
                </ListItem>
              ),
          )
        ) : (
          <ListItem className={classes.root}>
            <Box>
              <ListItemAvatar>
                <Avatar>
                  <AccessTimeIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Nothing to see here.."
                secondary="Move along.."
              />
            </Box>
          </ListItem>
        )}
      </List>
    </Container>
  );
}
