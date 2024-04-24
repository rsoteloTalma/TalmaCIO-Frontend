import React from "react";
import {
  Typography,
  Grid,
} from "@mui/material";

import { getUser } from "../../shared/auth-service";

const Home = () => {
  const user = getUser();
  const name = user.name;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1} >
            <Grid item xs={12}>
              <Typography variant="h5" style={{ color: "#8ebb37" }} fontWeight="bold" sx={{ flexGrow: 1, m: 1, }}>
                <b>Hola {name}!</b>
              </Typography>
              <Typography variant="h5" style={{ color: "#1a3072" }} fontWeight="bold" sx={{ flexGrow: 1, m: 1, }}>
                <i>Bienvenido a <span style={{ color: "#00b0ef" }}><b>Talma</b></span></i>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
