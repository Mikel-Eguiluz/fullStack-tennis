import React from "react";
import Header from "./../../components/header/header";
import { Typography, Box } from "@material-ui/core";

function NotFound() {
  return (
    <div>
      <Header />

      <Box>
        <Typography align="center" variant="h3">
          404 Not Found
        </Typography>
      </Box>
    </div>
  );
}

export default NotFound;
