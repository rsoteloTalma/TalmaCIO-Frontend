import React, { useEffect, useRef, useState } from "react";
import { Alert, Autocomplete, Box, Button, CircularProgress, Drawer, Grid, IconButton, List, ListItem, ListItemText, TextField, Tooltip } from "@mui/material";
import { Add, Check, Close, DeleteOutline } from "@mui/icons-material";

import { Dayjs } from "dayjs";
import dayjs  from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Bogota");

// import { ValidateLeaders, Sequences } from "./logic";
import { GridSettingsProps } from "./interface";

import { ACTIONS } from "../../../shared/constants";
import { getUser } from "../../../shared/auth-service";
import { GetGateByAirport, GetLeadersByAirport } from "../../itinerary-list/add/logic";

const user = getUser();

const PlannerSettings: React.FC<GridSettingsProps> = ({ open, data, handleClose, handleDefineGrid }) => {
  console.log('data :>> ', data);
  const [loading, setLoading] = useState<boolean>(true);

  // const [serviceHeaderId, setServiceHeaderId] = useState<number>(data.serviceHeaderId ?? 0);
  const [leaderId, setLeaderId] = useState<number | null>(null);
  const [checkServiceType, setCheckServiceType] = useState<boolean>(true);

  // const [timeArrival, setTimeArrival] = useState<Dayjs | null>(dayjs(data.sta));
  // const [timeDeparture, setTimeDeparture] = useState<Dayjs | null>(dayjs(data.std));


  // Return To Grid
  const handleSendData = (params: any[]) => {
    handleDefineGrid(params);
    handleClose(false);
  }

  if (Object.keys(data).length === 0) { return false; }


  const handleAddData = (params: Record<string, any>) => {
    return true;
  };


  return (
    <Drawer anchor="right" open={open} onClose={() => handleClose(false)} PaperProps={{ sx: { width: "30%" } }} >
      <Box role="presentation">

        <List sx={{bgcolor: "#FAFAFA", padding:0}}>
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="close" onClick={() => handleClose(false)}>
                <Close />
              </IconButton>
            }
          >
            <ListItemText
              primary={`CONFIGURACIÓN`}
            />
          </ListItem>
        </List>

        <Box margin={2}>
            <Grid container spacing={2}>
              <Grid item sm={12}>

              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item sm={12}>
                {/* <Autocomplete
                  id="simple-leader"
                  options={leaderstList}
                  getOptionLabel={(option) => option.description ?? "" }
                  renderInput={(params) => (
                    <TextField {...params} label="Leaders" placeholder="Seleccionado(s)" size="small" />
                  )}
                  sx={{ width: "100%" }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={leaderId !== null ? leaderstList.find(option => option.id === leaderId) : null}
                  onChange={(event, newValue) => {
                    if(newValue){
                      setLeaderId(newValue.id);
                      setLeaderDescription(newValue.description);
                    } else {
                      setLeaderId(null);
                      setLeaderDescription(null);
                    }
                  }}
                /> */}
              </Grid>

              <Grid item sm={6}>

              </Grid>

              <Grid item sm={6}>

              </Grid>
            </Grid>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                startIcon={<Check />}
                // onClick={handleSendData}
                // disabled={(rowDataSeq.length > 0) ? false: true}
              >
                {ACTIONS.SAVE}
              </Button>

              <Button
                variant="outlined"
                startIcon={<Add />}
                // onClick={() => handleAddData({
                //     leaderId,
                //     leaderDescription
                //   })
                // }
              >
                AGREGAR
              </Button>
            </div>
        </Box>
      </Box>
    </Drawer>
  );
}

export default PlannerSettings;
