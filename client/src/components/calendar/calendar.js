import React, { useState, useContext, useEffect } from "react";
import { Button, Paper, Box } from "@material-ui/core";
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
  // if (8 > CalendarStartHrs || CalendarStartHrs > 20) {
  if (8 > CalendarStartHrs) {
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
    // console.log(startDate, endDate);
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

  //const [data] = schedulerData;

  //console.log("data", schedulerData);

  const HeaderContent = () => {
    return <></>;
  };
  const TooltipContent = ({
    appointmentData,
    appointmentResources,
    ...restProps
  }) => {
    const resource = appointmentResources[0];
    const date = appointmentData.startDate;

    return (
      <AppointmentTooltip.Content
        {...restProps}
        appointmentData={appointmentData}
      >
        {!appointmentData.isBooked && (
          <Box display="flex" justifyContent="space-around">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addBooking({
                  startDateTime: date,
                  court: resource.text,
                  userName: user.name,
                  userId: user.sub,
                });
                console.log("resource ", restProps);
                // console.log("appointmentData ", appointmentData);
              }}
            >
              Book This Slot
            </Button>
          </Box>
        )}
      </AppointmentTooltip.Content>
    );
  };

  return (
    <Paper>
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
      {CalendarStartHrs > 20 ? (
        <h1> no more slots available today</h1>
      ) : (
        <Scheduler data={schedulerData}>
          <ViewState currentDate={currentDate} />
          <GroupingState grouping={grouping} />
          <DayView startDayHour={CalendarStartHrs} endDayHour={20} />
          <Appointments />
          <Resources data={resources} mainResourceName="courtId" />
          <IntegratedGrouping />
          <GroupingPanel />
          {isAuthenticated && (
            <AppointmentTooltip
              contentComponent={TooltipContent}
              headerComponent={HeaderContent}
            />
          )}
        </Scheduler>
      )}
    </Paper>
  );
}
