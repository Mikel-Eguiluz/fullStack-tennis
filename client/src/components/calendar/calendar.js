import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import {
  Button,
  Paper,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@material-ui/core";
// import { spacing } from "@material-ui/system";
import {
  ViewState,
  GroupingState,
  IntegratedGrouping,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Resources,
  DayView,
  Appointments,
  GroupingPanel,
  // AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";

import { useAuth0 } from "@auth0/auth0-react";

import { BookingsContext } from "./../../contexts/bookings.context";
export default function Calendar() {
  const {
    bookings,

    loaded,
    loading,
    // error,
    addBooking,
    fetchBookings,
  } = useContext(BookingsContext);

  const { user, isAuthenticated } = useAuth0();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState({});
  const [resources] = useState([
    {
      fieldName: "courtId",
      title: "court",
      instances: [
        { text: "Court 1", id: 1 },
        { text: "Court 2", id: 2 },
        { text: "Court 3", id: 3 },
        { text: "Court 4", id: 4 },
        { text: "Court 5", id: 5 },
        { text: "Court 6", id: 6 },
        { text: "Court 7", id: 7 },
      ],
    },
  ]);
  const [grouping] = useState([
    {
      resourceName: "courtId",
    },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // console.log("in useEffect", bookings, loaded, loading);
    if (!loading && !loaded) {
      fetchBookings();
    }
  }, [loaded, fetchBookings, bookings, loading]);

  let schedulerData = [];

  let startDate = new Date(currentDate);
  let endDate = new Date(currentDate);

  let CalendarStartHrs = new Date().getHours() + 1;
  if (8 > CalendarStartHrs) {
    console.log(CalendarStartHrs);
    CalendarStartHrs = 8;
  }

  if (
    new Date(currentDate).setHours(0, 0, 0, 0) !==
    new Date().setHours(0, 0, 0, 0)
  ) {
    CalendarStartHrs = 8;
  }
  for (let i = CalendarStartHrs; i < 20; i++) {
    startDate.setHours(i, 0, 0, 0);
    endDate.setHours(i + 1, 0, 0, 0);
    for (let i = 1; i < 8; i++) {
      const appointment = {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        courtId: i,
        title: "Book this slot",
        userName: null,
        userId: null,
      };
      for (const booked of bookings) {
        const bookedDate = new Date(booked.startDateTime);
        if (
          bookedDate.toISOString() === appointment.startDate.toISOString() &&
          "Court " + appointment.courtId === booked.court
        ) {
          appointment.isBooked = true;
          appointment.title = "BOOKED";
        }
      }
      schedulerData.push(appointment);
    }
  }
  console.log(CalendarStartHrs);

  const Appointment = ({
    children,
    data,
    style,
    // onClick,

    ...restProps
  }) => {
    const bgColor = data.title !== "BOOKED" ? "" : "#a19999";
    // console.log(onClick);
    return (
      <Appointments.Appointment
        data={data}
        style={{
          backgroundColor: bgColor,
          ...style,
        }}
        {...restProps}
        onClick={
          isAuthenticated &&
          data.title !== "BOOKED" &&
          (() => {
            console.log(data);
            setActiveSlot(data);
            setModalOpen(true);
          })
        }
      >
        {children}
      </Appointments.Appointment>
    );
  };
  const BookDialog = () => {
    return (
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {moment(activeSlot.startDate).format("dddd Do MMM , h:mm a")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Court {activeSlot.courtId}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              addBooking({
                startDateTime: activeSlot.startDate,
                court: "Court " + activeSlot.courtId,
                userName: user.name,
                userId: user.sub,
              });
              setModalOpen(false);
            }}
            color="primary"
            autoFocus
          >
            Book
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Paper align="center">
      <Box py={1} display="flex" justifyContent="space-around">
        <Button
          disabled={new Date() >= new Date(currentDate)}
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => {
            setCurrentDate(
              new Date(currentDate.setDate(currentDate.getDate() - 1)),
            );
          }}
        >
          Previous Day
        </Button>

        <Button
          disabled={new Date() >= new Date(currentDate)}
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => {
            setCurrentDate(new Date());
          }}
        >
          Today
        </Button>

        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => {
            setCurrentDate(
              new Date(currentDate.setDate(currentDate.getDate() + 1)),
            );
          }}
        >
          Next Day
        </Button>
      </Box>
      {CalendarStartHrs >= 20 ? (
        <Typography variant="h1">
          No more slots available today, try tomorrow
        </Typography>
      ) : (
        <Scheduler data={schedulerData}>
          <ViewState currentDate={currentDate} />
          <GroupingState grouping={grouping} />
          <DayView startDayHour={CalendarStartHrs} endDayHour={20} />
          <Appointments appointmentComponent={Appointment} />
          <Resources data={resources} mainResourceName="courtId" />
          <IntegratedGrouping />
          <GroupingPanel />
          <BookDialog />
        </Scheduler>
      )}
    </Paper>
  );
}
