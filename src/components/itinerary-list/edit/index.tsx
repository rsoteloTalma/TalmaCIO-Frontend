import React, { useEffect, useState } from "react";
import { Alert, Autocomplete, Avatar, Box, Button, CircularProgress, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField } from "@mui/material";
import { Check, Close, Flight, PinDrop } from "@mui/icons-material";

import { EditProps } from "./interface";
import { GetAircraftByCompany, GetConveyorByAirport, GetGateByAirport } from "../add/logic";
import { getItineraryFilters } from "../logic";
import { ACTIONS } from "../../../shared/constants";
import { getUser } from "../../../shared/auth-service";
import { EditItinerary } from "./logic";

const user = getUser();

const ItineraryEdit: React.FC<EditProps> = ({ open, data, handleClose, handleEdit }) => {

  const [loading, setLoading] = useState<boolean>(true);
  const [aircraftList, setAircraftList] = useState<any[]>([]);
  const [gateList, setGateList] = useState<any[]>([]);
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [conveyorList, setConveyorList] = useState<any[]>([]);

  const [gateId, setGateId] = useState<number | null>(data.gate?.id ?? null);
  const [serviceTypeId, setServiceTypeId] = useState<number | null>(data.serviceType?.id ?? null);
  const [registrationId, setRegistrationId] = useState<number | null>(data.aircraft?.id ?? null);
  const [conveyorId, setConveyorId] = useState<number | null>(data.conveyor?.id ?? null);
  const [terminal, setTerminal] = useState<string | null>(data.terminal ?? "");

  // load
  useEffect(() => {
    async function fetchData() {
      if (loading) {
        try {
          const aircraft = await GetAircraftByCompany(data.company.id);
          const gate = await GetGateByAirport(data.base.id);
          const conveyor = await GetConveyorByAirport(data.base.id);
          const filter = await getItineraryFilters();

          setAircraftList(aircraft);
          setGateList(gate);
          setConveyorList(conveyor);
          setServiceList(filter.serviceTypes);
          setLoading(false);

        } catch (error) {
          setAircraftList([]);
          setGateList([]);
          setConveyorList([]);
          setServiceList([]);
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [loading]);


  const handleSendData = async (params: Record<string, any>) => {
    const sendData = await EditItinerary(params);
    handleEdit(sendData);
    handleClose(false);
  }

  if (Object.keys(data).length === 0) { return false; }

  return (
    <Drawer anchor="right" open={open} onClose={() => handleClose(false)} PaperProps={{ sx: { width: "25%" } }} >
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
              primary={data.itineraryElementId}
              secondary="Itinerario"
            />
          </ListItem>
        </List>

        <Box>
          <List>
            <ListItem
              divider={true}
              dense={true}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#1A3072" }}>
                  <PinDrop />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={data.base.description} secondary="Estación" />
            </ListItem>
            <ListItem
              divider={true}
              dense={true}
              secondaryAction={
                <img
                  alt={`${data.company.description} Flag`}
                  src={`https://content.airhex.com/content/logos/airlines_${data.company.description}_100_30_r.png`}
                />
              }
            >
              <ListItemAvatar>
                <Avatar><Flight /></Avatar>
              </ListItemAvatar>
              <ListItemText primary={data.company.description} secondary={data.aircraft?.description ?? ""} />
            </ListItem>
          </List>

          { loading ? (
            <center>
              <CircularProgress />
            </center>
          ) : (

            <Box margin={1}>
              <Autocomplete
                id="simple-gate"
                options={gateList}
                getOptionLabel={(option) => option.description ?? "" }
                renderInput={(params) => (
                  <TextField {...params} label="Gate" placeholder="Seleccionado(s)" size="small" />
                )}
                sx={{ width: "100%", marginBottom: 2 }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={gateId !== null ? gateList.find(option => option.id === gateId) : null}
                onChange={(event, newValue) => {
                  if(newValue){
                    setGateId(newValue.id);
                  } else {
                    setGateId(null);
                  }
                }}
              />

              <Autocomplete
                id="simple-service-type"
                disableClearable={true}
                options={serviceList}
                getOptionLabel={(option) => option.description ?? "" }
                renderInput={(params) => (
                  <TextField {...params} label="Tipo de Servicio" placeholder="Seleccionado(s)" size="small" />
                )}
                sx={{ width: "100%", marginBottom: 2 }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={serviceTypeId !== null ? serviceList.find(option => option.id === serviceTypeId) : null}
                onChange={(event, newValue) => {
                  setServiceTypeId(newValue?.id ?? 0);
                }}
              />

              <Autocomplete
                id="simple-aircraft"
                options={aircraftList}
                getOptionLabel={(option) => option.description ?? ""}
                renderInput={(params) => (
                  <TextField {...params} label="Matrícula" placeholder="Seleccionado(s)" size="small" />
                )}
                sx={{ width: "100%", marginBottom: 2 }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={registrationId !== null ? aircraftList.find(option => option.id === registrationId) : null}
                onChange={(event, newValue) => {
                  if(newValue){
                    setRegistrationId(newValue.id);
                  } else {
                    setRegistrationId(null);
                  }
                }}
              />

              <Autocomplete
                id="simple-conveyor"
                options={conveyorList}
                getOptionLabel={(option) => option.description ?? ""}
                renderInput={(params) => (
                  <TextField {...params} label="Banda" placeholder="Seleccionado(s)" size="small" />
                )}
                sx={{ width: "100%", marginBottom: 2 }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={conveyorId !== null ? conveyorList.find(option => option.id === conveyorId) : null}
                onChange={(event, newValue) => {
                  if(newValue){
                    setConveyorId(newValue.id);
                  } else {
                    setConveyorId(null);
                  }
                }}
              />

              <TextField
                id="simple-terminal"
                size="small"
                label="Terminal"
                variant="outlined"
                sx={{ width: "100%", marginBottom: 2 }}
                value={terminal}
                onChange={(event) => setTerminal(event.target.value)}
              />

              <Alert severity="info">Por favor verificar los cambios realizados.</Alert>
              <Button
                variant="contained"
                startIcon={<Check />}
                sx={{ marginTop: 2}}
                onClick={() => handleSendData({
                    user: user.employeeId,
                    elementItineraryId: data.itineraryElementId,
                    serviceTypeId,
                    gateId,
                    registrationId,
                    conveyorId,
                    terminal
                  })
                }
              >
                {ACTIONS.SAVE}
              </Button>
            </Box>
          )}

        </Box>
      </Box>
    </Drawer>
  );
}

export default ItineraryEdit;
