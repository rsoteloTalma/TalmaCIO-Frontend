import React, { FormEvent, useState } from "react";
import {
    Paper,
    FormControl,
    TextField,
    Link,
    Button
} from "@mui/material";
import { paperStyles, loginStyles, linkStyles } from "./styles";
import { BUTTONS, MESSAGES } from "../../shared/constants";
import { validateUser, RecoveryPassword } from "./logic";
import AcceptDialog from "../accept-modal";

const Login: React.FC = () => {
  const [login, setLogin] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const baseUrl = window.location.origin;
  const logo = `${baseUrl}/logo.png`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (field) {
        case "login":
          document.getElementById("password-input")?.focus();
          break;
        case "password":
          setLoading(true);
          validateUser(login, password, false, setMessage, setOpen);
          break;
        default:
          break;
      }
    }
  };

  const handleClose = () => {
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      {open && <AcceptDialog
        handleAccept={null}
        handleClose={handleClose}
        dialogContentText={message ?? ""}
        dialogTitle={MESSAGES.ALERT}
        open={open}
      />}

      <Paper elevation={10} style={paperStyles}>
        <FormControl fullWidth={true} margin="dense">
          <input type="hidden" name="appId" value="2" />
          <img src={logo} alt="logo" style={loginStyles} />
          <TextField
            label="Usuario"
            placeholder="Usuario"
            value={login || ""}
            onChange={(e) => setLogin(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<HTMLInputElement>, 'login')}
            fullWidth
          />
          <p />
          <TextField
            id="password-input"
            label="Clave"
            placeholder="Clave"
            value={password || ""}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<HTMLInputElement>, 'password')}
            fullWidth
          />
          <p />
          <Button
            fullWidth
            disabled={loading}
            color="primary"
            variant="contained"
            onClick={() => {
              setLoading(true);
              validateUser(login, password, false, setMessage, setOpen);
            }}
          >
            {loading ? "Cargando..." : BUTTONS.LOGIN}
          </Button>
          <Link
            style={linkStyles}
            component="button"
            variant="body2"
            onClick={() => {
              setLoading(true);
              RecoveryPassword(login, true, setMessage, setOpen);
            }}
          >
            ¿Olvidó su Clave?
          </Link>
        </FormControl>
      </Paper>
    </>
  );
};

export default Login;
