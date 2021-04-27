import React from "react";

import { Typography, Button, Box } from "@material-ui/core";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";

import { useAuth0 } from "@auth0/auth0-react";

export default function LogoutButton() {
  const { logout, user, isAuthenticated } = useAuth0();
  // console.log(user);
  return (
    isAuthenticated && (
      <Box>
        <Typography variant="h6">{user.name}</Typography>
        <Button
          color="inherit"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          <AccountCircleRoundedIcon />
          <Typography variant="h6">&nbsp;Logout</Typography>
        </Button>
      </Box>
    )
  );
}
