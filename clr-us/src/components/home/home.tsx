import { Typography, Box } from "@mui/material";
import React from "react";
import { useRedirectLogin } from "../../hooks";

export const Home: React.FC = () => {

  useRedirectLogin()

    return (
      <Box>
        <Typography variant="h1" component="h1">
          Home
        </Typography>
      </Box>
    );

};
