import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Paper,
  Grid,
  TextField,
  FormControl,
} from "@mui/material";

import { BUTTONS, MESSAGES } from "../../shared/constants";
import AcceptDialog from "../accept-modal";
import { paperStyles, loginStyles } from "./styles";
import { changePasswordUser } from "./logic";


const UpdatePassword = () => {
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>("");
  const { key } = useParams();
  const [loading, setLoading] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const showButton = () => {
    if (!password || !passwordConfirmation)  return false;
    if (password.length < 1 || passwordConfirmation.length < 1) return false;
    if (password !== passwordConfirmation) return false;
    return true;
  };

  return (
    <Grid>
      {open && <AcceptDialog
        handleAccept={handleClickOpen}
        handleClose={handleClose}
        dialogContentText={message ?? ""}
        dialogTitle={MESSAGES.ALERT}
        open={open}
      />}

      <Paper elevation={10} style={paperStyles} >
        <FormControl fullWidth={true} margin="dense">
          <img src="../logo.png" alt="logo" style={loginStyles} />
          <TextField
            label="Nueva clave"
            placeholder="Nueva clave"
            value={password || ""}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            fullWidth />
          <p />
          <TextField
            label="Confirmar clave"
            placeholder="Confirmar clave"
            value={passwordConfirmation || ""}
            type="password"
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            fullWidth  />
          <p />
          <Button
            fullWidth
            color="primary"
            variant="contained"
            disabled={!showButton()||loading}
            onClick={() => {
              setLoading(true);
              changePasswordUser(
                password,
                setMessage,
                setOpen,
                key ?? "");
            }}
          >
            {loading ? "Cargando..." : BUTTONS.CHANGE_PASSWORD_USER} 
          </Button>
        </FormControl>
      </Paper>
    </Grid>
  );
};

export default UpdatePassword;
