import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Alert, Grid, Paper, LinearProgress, Box } from "@mui/material";
import { Check, Warning } from "@mui/icons-material";

import { TITLES } from "../../shared/constants";
import { resetPasswordUser } from "./logic";
import { paperStyles, loginStyles } from "./styles";

interface MessageData {
  success: boolean;
  email: string;
}

const ResetPassword = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<MessageData | null>(null);
  const { key } = useParams();

  useEffect(() => {
    async function fetchData() {
      if (loading) {
        try {
          const myMain = await resetPasswordUser(key ?? "", false);
          setMessage(myMain.data);

          setLoading(false);
          // setTimeout(() => { setLoading(false); }, 3000);

        } catch (error) {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [loading]);

  return (
    <Grid>
      <Paper elevation={10} style={paperStyles} >
        <Grid container justifyContent="center" alignItems="center">
          <img src="../logo.png" alt="logo" style={loginStyles} />
          <Alert severity="info">{TITLES.MESSAGE_RECOVER_PASSWORD_LINK}</Alert>
          <p />
          <Box sx={{ width: "100%", marginTop: 1 }}>
            {loading && <LinearProgress />}
            {message && !loading && (
              <>
                {message.success ? (
                  <Alert icon={<Check fontSize="inherit" />} severity="success">
                    Envío correcto a: {message.email}
                  </Alert>
                ) : (
                  <Alert icon={<Warning fontSize="inherit" />} severity="error">
                    Error al enviar a: {message.email}
                  </Alert>
                )}
              </>
            )}
          </Box>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default ResetPassword;
