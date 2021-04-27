import React from "react";

import {
  AppBar,
  Toolbar,
  // IconButton,
  Typography,
  Button,
  Box,
} from "@material-ui/core";

import SportsBaseballRoundedIcon from "@material-ui/icons/SportsBaseballRounded";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../loginButton/loginButton.js";
import LogoutButton from "../logoutButton/logoutButton.js";

export default function Header() {
  const { isAuthenticated } = useAuth0();
  return (
    <>
      <AppBar>
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Box display="flex">
            <Button href="./" edge="start" color="inherit" aria-label="home">
              <SportsBaseballRoundedIcon fontSize="large" />
              <Typography variant="h6"> &nbsp;HOME </Typography>
            </Button>

            {isAuthenticated && (
              <Box borderLeft={1} borderColor="grey.500">
                <Button
                  href="./mybookings"
                  edge="start"
                  color="inherit"
                  aria-label="home"
                >
                  <Typography variant="h6"> My Bookings</Typography>
                </Button>{" "}
              </Box>
            )}
          </Box>
          <Typography variant="h6"> Brondesbury Tennis Booking</Typography>
          <Box>
            <LogoutButton />
            <LoginButton />
          </Box>
        </Toolbar>
      </AppBar>
      <Box style={{ height: "65px" }}></Box>
    </>
  );
}
