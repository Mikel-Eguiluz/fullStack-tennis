import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  Button,
  Typography,
  Paper,
  CardActions,
  CardContent,
} from "@material-ui/core";
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
  Toolbar,
  DateNavigator,
  TodayButton,
  GroupingPanel,
  AppointmentTooltip,
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

  // var today = new Date(Date.now());
  // let currentDate =
  //   today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  //let CalendarStartHrs = today.getHours() + 1;
  // let CalendarStartHrs = today.getHours() + 1;
  // if (8 > CalendarStartHrs || CalendarStartHrs > 20) {
  //   CalendarStartHrs = 8;
  // }
  //TODO remove
  // CalendarStartHrs = 10;

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
  //const [schedulerData, setSchedulerData] = useState([]);

  useEffect(() => {
    // console.log("in useEffect", bookings, loaded, loading);
    if (!loading && !loaded) {
      fetchBookings();
    }
  }, [loaded, fetchBookings, bookings, loading]);

  let schedulerData = [];
  const dayOfTheMonth = new Date().getDate();
  for (let i = 0; i < 3; i++) {
    let startDate = new Date();
    startDate.setDate(dayOfTheMonth + i);
    let endDate = new Date();
    endDate.setDate(dayOfTheMonth + i);
    for (let i = 8; i < 20; i++) {
      startDate.setHours(i, 0, 0, 0);
      endDate.setHours(i + 1, 0, 0, 0);
      console.log(startDate, endDate);
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
            // console.log("appointment", appointment.courtId);
            // console.log("booked", booked.court);
          }
        }
        schedulerData.push(appointment);
      }
    }
  }

  //const [data] = schedulerData;

  //console.log("data", schedulerData);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const TooltipContent = ({ appointmentData, appointmentResources }) => {
    const resource = appointmentResources[0];
    const date = appointmentData.startDate;

    return appointmentData.isBooked ? (
      <Card>
        <CardContent>
          <Typography variant="h6" align="center">
            {days[date.getDay()] +
              "  " +
              date.getDate() +
              "  " +
              date.getHours() +
              "-" +
              appointmentData.endDate.getHours() +
              "hrs"}
          </Typography>

          <Typography variant="h6" align="center">
            {resource.text}
          </Typography>
          <Typography variant="h6" align="center">
            NOT AVAILABLE
          </Typography>
        </CardContent>
      </Card>
    ) : (
      <Card>
        <CardContent>
          <Typography variant="h6" align="center">
            {days[date.getDay()] +
              "  " +
              date.getDate() +
              "  " +
              date.getHours() +
              "-" +
              appointmentData.endDate.getHours() +
              "hrs"}
          </Typography>

          <Typography variant="h6" align="center">
            {resource.text}
          </Typography>
        </CardContent>
        <CardActions style={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => {
              addBooking({
                startDateTime: date,
                court: resource.text,
                userName: user.name,
                userId: user.sub,
              });
              //console.log("resource ", resource);
              // console.log("appointmentData ", appointmentData);
            }}
          >
            Book This Slot
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Paper>
      <Scheduler data={schedulerData}>
        <ViewState
          defaultCurrentDate={
            new Date().getHours() > 19
              ? new Date().setDate(new Date().getDate() + 1)
              : new Date()
          }
        />
        <GroupingState grouping={grouping} />
        <DayView startDayHour={8} endDayHour={20} />
        {/* <DayView /> */}
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <Appointments />
        <Resources data={resources} mainResourceName="courtId" />
        <IntegratedGrouping />
        <GroupingPanel />
        {isAuthenticated && (
          <AppointmentTooltip contentComponent={TooltipContent} />
        )}
      </Scheduler>
    </Paper>
  );
}
