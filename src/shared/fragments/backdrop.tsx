import * as React from "react";
import {
    CircularProgress,
    Box,
    Backdrop, 
} from "@mui/material";

export default function BackDrop() {
  return (
    <Backdrop
        sx={{ backgroundColor: "#1a307252", color: "white", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
    >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CircularProgress color="inherit" />
        <p>Cargando información...</p>
        </Box>
    </Backdrop>
  );
}
