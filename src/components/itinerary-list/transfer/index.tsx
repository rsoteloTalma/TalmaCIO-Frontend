import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardHeader,
  Avatar,
  LinearProgress,
  Paper,
  Divider,
  Alert,
  AlertTitle
} from "@mui/material";

import { Check, Cancel, ConnectingAirports } from "@mui/icons-material";
import { ItineraryTransferProps } from "./interface";
import { ACTIONS } from "../../../shared/constants";

import { sendItineraryTransfer } from "./logic";
import BackDrop from "../../../shared/fragments/backdrop";

const ItineraryTransfer: React.FC<ItineraryTransferProps> = ({ data, handleTransferSave, handleTransferClose }) => {

  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(false);
  const [consolide, setConsolide] = useState<any[]>([]);
  const [sendData, setSendData] = useState<any[]>([]);

  // prepare sendData
  useEffect(() => {
    async function fetchData() {
      if (loading) {
        try {
          const count = 1;
          const prepare: any = [];
          const send: any = [];
 
          data.forEach((items: any) => {
            send.push(items.itineraryElementId);
            const field = prepare.find((item: any) => item.company === items.company.description);

            if (field !== undefined) {
              const indexToUpdate = prepare.findIndex((line: any) => line.company === field.company);
              if (indexToUpdate !== -1){ prepare[indexToUpdate].count = field.count+=1; }

            } else {
              prepare.push({
                company: items.company.description,
                count: count
              });
            }
          });

          setConsolide(prepare);
          setSendData(send);
          setLoading(false);

        } catch (error) {
          setSendData([]);
          setConsolide([]);
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [loading]);


  const handleSave = async (params: Record<string, any>) => {
    setLoad(true);
    const sendTime = await sendItineraryTransfer(params);
    setLoad(false);
    handleTransferSave(sendTime);
  }

  if (load) return (<BackDrop />);

  return (
    <>
      <Dialog
        maxWidth="sm"
        fullWidth={true}
        open={true}
        scroll="body"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ p: 0, bgcolor:"#FAFAFA" }}>
          <CardHeader 
            avatar={
              <Avatar sx={{ bgcolor: "#D6F4FF" }} aria-label="recipe" variant="rounded">
                <ConnectingAirports sx={{ color: "#00B0EF" }} />
              </Avatar>
            }
            title={
              <Typography sx={{ color: "#1A3072" }} variant="button" display="block">
                Transferir Itinerario
              </Typography>
            }
            subheader="Línea de Tiempo"
            action={
              <Typography variant="h3" sx={{ color: "#1A3072", mr:4 }}>
                {sendData.length}
              </Typography>
            }
          />
        </DialogTitle>

        <DialogContent sx={{ pt: 0, bgcolor:"#FAFAFA"}}>
          <Alert severity="success">
            <AlertTitle>Atención</AlertTitle>
            Tras confirmar esta transferencia de itinerario y séan procesados de manera exitosa, los vuelos se verán reflejados en la línea de Tiempo CIO.
          </Alert>

          { loading && <LinearProgress /> }

          <Grid container spacing={2} sx={{mt:0}}>
            { consolide.map((items, index) => (
              <Grid item sm={6} md={6} key={index}>
                <Paper
                  component="form"
                  sx={{ p: "5px 20px", display: "flex", width: "100%", height: "70px", borderRadius: 1, justifyContent: "space-between", alignItems: "center" }}
                >
                  <img
                    alt={`${items.company} Flag`}
                    src={`https://content.airhex.com/content/logos/airlines_${items.company}_100_30_r.png`}
                  />
                  <Divider sx={{ height: 40, marginX: 1 }} orientation="vertical" />
                  <Typography variant="h4">
                    {items.count}
                  </Typography>
                </Paper>
              </Grid>
            )) }
          </Grid>
        </DialogContent>

        <DialogActions>
          <Box>
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleSave(sendData)}
              endIcon={<Check />}
            >
              {ACTIONS.SEND_ASSESMENT}
            </Button>
          </Box>
          <Box sx={{ m: 1, position: "relative" }}>
            <Button
              variant="outlined"
              onClick={() => handleTransferClose(false)}
              endIcon={<Cancel />}
              autoFocus
            >
              {ACTIONS.CANCEL}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ItineraryTransfer;
