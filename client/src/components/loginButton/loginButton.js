import React from "react";

import { Typography, Button } from "@material-ui/core";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";

import { useAuth0 } from "@auth0/auth0-react";

export default function LoginButton() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  return (
    !isAuthenticated && (
      <Button color="inherit" onClick={() => loginWithRedirect()}>
        <AccountCircleRoundedIcon />
        <Typography variant="h6">&nbsp;Login</Typography>
      </Button>
    )
  );
}
