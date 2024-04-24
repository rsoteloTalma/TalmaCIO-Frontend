import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery
} from "@mui/material";

import { AcceptDialogProps } from "./interface";
import { useTheme } from "@mui/material/styles";


const AcceptDialog: React.FC<AcceptDialogProps> = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { handleClose, dialogContentText, dialogTitle, handleAccept, open } = props;
  
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {handleAccept && (
            <Button onClick={handleAccept} autoFocus>
              Aceptar
            </Button>
          )}
          <Button onClick={handleClose} autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AcceptDialog;
