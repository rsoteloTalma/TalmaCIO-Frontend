import React, { useState } from "react";
import { Stack, Snackbar } from "@mui/material";

interface MessageSnackbarProps {
  message: string;
}

const MessageSnackbar: React.FC<MessageSnackbarProps> = ({ message }) => {
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={open}
        onClose={handleClose}
        message={message}
        autoHideDuration={5000}
      />
    </Stack>
  );
};

export default MessageSnackbar;
