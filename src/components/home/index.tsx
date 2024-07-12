import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";

import { getUser } from "../../shared/auth-service";
import { Flight } from "@mui/icons-material";

const Home = () => {
  const user = getUser();
  const name = user.name;

  return (
    <>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <Typography variant="h5" style={{ color: "#8ebb37" }} fontWeight="bold" sx={{ flexGrow: 1, m: 1, }}>
            <b>Hola {name}!</b>
          </Typography>
          <Typography variant="h5" style={{ color: "#1a3072" }} fontWeight="bold" sx={{ flexGrow: 1, m: 1, }}>
            <i>Bienvenido a <span style={{ color: "#00b0ef" }}><b>Talma</b></span></i>
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid item xs={12} style={{ marginBottom: 20 }}>
            <iframe width="100%" height="400" src="https://www.youtube.com/embed/OIs3yE6daWk" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={1} >
            <Grid item xs={6} sm={4} md={4} >
              <Card sx={{ maxWidth: 200 }} style={{ backgroundColor: "#00000008" }}>
                <CardActionArea style={{ textAlign: "center" }} href="/itinerary/addFile">
                  <Flight sx={{ fontSize: 65 }} style={{ textAlign: "center", color: "#27b9d4" }} />
                  <CardContent style={{ padding: "0" }}>
                    <Typography gutterBottom variant="h5" component="div" style={{ color: "#8ebb37", fontWeight: "bold", margin: "0" }}>
                      Gestión de
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div" style={{ color: "#1a3072", fontWeight: "bold" }}>
                      Itinerarios
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
