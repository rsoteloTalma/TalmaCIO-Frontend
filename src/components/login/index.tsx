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

// --- revisar enter al acceder
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // event.preventDefault();
    // setLoading(true);
    // validateUser(login, password, false, setMessage, setOpen);
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
        {/* <form onSubmit={handleSubmit}> */}
          <FormControl fullWidth={true} margin="dense">
            <input type="hidden" name="appId" value="1" />
            <img src={logo} alt="logo" style={loginStyles} />
            <TextField
              label="Usuario"
              placeholder="Usuario"
              value={login || ""}
              onChange={(e) => setLogin(e.target.value)}
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
        {/* </form> */}
      </Paper>
    </>
  );
};

export default Login;
