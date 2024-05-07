import React, { useEffect, useState } from "react";
import { Autocomplete, Avatar, Box, Button, CardHeader, Drawer, Grid, IconButton, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { Close, ConnectingAirports, FlightLand, FlightTakeoff } from "@mui/icons-material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { Dayjs } from "dayjs";
import dayjs  from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Bogota");

import { AddProps } from "./interface";
import { filterData } from "../interface";

import { ACTIONS, TITLES } from "../../../shared/constants";
import { getUser } from "../../../shared/auth-service";

import { GetAircraftByCompany, GetGateByAirport, GetConveyorByAirport, AddItinerary } from "./logic";

const user = getUser();

const ItineraryAdd: React.FC<AddProps> = ({ open, handleClose, dataFilters, handleAdd }) => {

  const [serviceTypeId, setServiceTypeId] = useState<number>(0);
  const [incomingFlight, setIncomingFlight] = useState<string>("");
  const [outgoingFlight, setOutgoingFlight] = useState<string>("");
  const [aircraftTypeId] = useState<number | null>(null);
  const [estimatedTimeArrival, setEstimatedTimeArrival] = useState<Dayjs | null>(dayjs());
  const [estimatedTimeDeparture, setEstimatedTimeDeparture] = useState<Dayjs | null>(dayjs());
  const [terminal, setTerminal] = useState<string>("");
  const [observation, setObservation] = useState<string>("");
  const [baseId, setBaseId] = useState<number | null>(null);
  const [airlineId, setAirlineId] = useState<number>(0);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [originId, setOriginId] = useState<number>(0);
  const [destinyId, setDestinyId] = useState<number>(0);
  const [gateId, setGateId] = useState<number | null>(null);
  const [conveyorId, setConveyorId] = useState<number | null>(null);
  const [boardingGate, setBoardingGate] = useState<string>("");

  const [aircraftTypeList, setAircraftTypeList] = useState<any[]>([]);
  const [gateList, setGateList] = useState<any[]>([]);
  const [conveyorList, setConveyorList] = useState<any[]>([]);

  const [loadAirline, setLoadAirline] = useState<number>(0);
  const [loadAirport, setLoadAirport] = useState<number>(0);

  // // load list
  useEffect(() => {
    async function fetchData() {
      if (loadAirline > 0) {
        try {
          const aircraftList = await GetAircraftByCompany(loadAirline);
          setAircraftTypeList(aircraftList);
          setLoadAirline(0);

        } catch (error) {
          setLoadAirline(0);
          setAircraftTypeList([]);
        }
      }

      if (loadAirport > 0) {
        try {
          const gateByList = await GetGateByAirport(loadAirport);
          setGateList(gateByList);

          const conveyorByList = await GetConveyorByAirport(loadAirport);
          setConveyorList(conveyorByList);
          setLoadAirport(0);

        } catch (error) {
          setLoadAirport(0);
          setGateList([]);
          setConveyorList([]);
        }
      }
    }
    fetchData();
  }, [loadAirline, loadAirport]);


  const handleSendData = async (params: Record<string, any>) => {
    const sendData = await AddItinerary(params);
    resetStates();
    handleAdd(sendData);
    handleClose(false);
  }

  const resetStates = () => {
    setServiceTypeId(0);
    setIncomingFlight("");
    setOutgoingFlight("");
    setEstimatedTimeArrival(dayjs());
    setEstimatedTimeDeparture(dayjs());
    setTerminal("");
    setObservation("");
    setBaseId(null);
    setAirlineId(0);
    setRegistrationId(null);
    setOriginId(0);
    setDestinyId(0);
    setGateId(null);
    setConveyorId(null);
    setBoardingGate("");
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => handleClose(false)} PaperProps={{ sx: { width: "50%" } }} >
      <Box role="presentation">
        <List>
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="close" onClick={() => handleClose(false)}>
                <Close />
              </IconButton>
            }
          >
            <ListItemText
              primary={ACTIONS.NEW.toUpperCase()}
            />
          </ListItem>
        </List>

        <Box margin={2}>
          <Grid container spacing={2}>
            <Grid item sm={6}>
              <Autocomplete
                id="simple-base"
                options={(dataFilters?.airports ?? []) as filterData[]}
                getOptionLabel={(option) => option?.description ?? "" }
                //options={user.setAirports ?? []}
                //getOptionLabel={(option: any) => option?.code ?? "" }
                renderInput={(params) => (
                  <TextField {...params} label="Base" placeholder="Seleccionado(s)" size="small" />
                )}
                sx={{ width: "100%", marginBottom: 2 }}
                onChange={(event, newValue) => {
                  if(newValue){
                    setBaseId(newValue?.id ?? 0);
                    setLoadAirport(newValue?.id ?? 0);
                  } else {
                    setGateId(null);
                    setGateList([]);
                    setConveyorId(null);
                    setConveyorList([]);
                  }
                }}
              />

              <Autocomplete
                id="simple-gate"
                options={gateList}
                getOptionLabel={(option) => option.description ?? "" }
                renderInput={(params) => (
                  <TextField {...params} label="Gate" placeholder="Seleccionado(s)" size="small" />
                )}
                sx={{ width: "100%" }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValue) => {
                  if(newValue){
                    setGateId(newValue.id);
                  } else {
                    setGateId(null);
                  }
                }}
              />
            </Grid>
            <Grid item sm={6}>
              <Autocomplete
                id="simple-service-type"
                options={(dataFilters?.serviceTypes ?? []) as filterData[]}
                getOptionLabel={(option) => option.description ?? "" }
                renderInput={(params) => (
                  <TextField {...params} label="Tipo de Servicio" placeholder="Seleccionado(s)" size="small" />
                )}
                sx={{ width: "100%", marginBottom: 2 }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValue) => {
                  setServiceTypeId(newValue?.id ?? 0);
                }}
              />

              <TextField
                id="simple-terminal"
                size="small"
                label="Terminal"
                variant="outlined"
                sx={{ width: "100%" }}
                value={terminal}
                onChange={(event) => setTerminal(event.target.value)}
              />
            </Grid>

            <Grid item sm={6}>
              <Autocomplete
                id="simple-airlines"
                options={(dataFilters?.airlines ?? []) as filterData[]}
                getOptionLabel={(option) => option.extra ?? "" }
                renderInput={(params) => (
                  <TextField {...params} label={TITLES.CUSTOMERS} placeholder="Seleccionado(s)" size="small" />
                )}
                sx={{ width: "100%"}}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValue) => {
                  setAirlineId(newValue?.id ?? 0);
                  setLoadAirline(newValue?.id ?? 0);
                  setRegistrationId(0);
                  setAircraftTypeList([]);
                }}
              />
            </Grid>
            <Grid item sm={6}>
              <Autocomplete
                id="simple-aircraft"
                options={aircraftTypeList}
                getOptionLabel={(option) => option.description ?? ""}
                renderInput={(params) => (
                  <TextField {...params} label="Matrícula" placeholder="Seleccionado(s)" size="small" />
                )}
                sx={{ width: "100%" }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValue) => {
                  if(newValue){
                    setRegistrationId(newValue.id);
                  } else {
                    setRegistrationId(null);
                  }
                }}
              />
            </Grid>

            <Grid item sm={6}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "#D6F4FF" }} aria-label="recipe" variant="rounded">
                    <FlightLand sx={{ color: "#00B0EF" }} fontSize="small" />
                  </Avatar>
                }
                title={
                  <Typography variant="button" display="block">
                    Llegada
                  </Typography>
                }
                sx={{ padding: 0, bgcolor: "#F9F9F9", marginBottom: 2 }}
              />

              <Autocomplete
                id="simple-origin"
                options={(dataFilters?.airports ?? []) as filterData[]}
                getOptionLabel={(option) => option?.description ?? "" }
                renderInput={(params) => (
                  <TextField {...params} label="Origen" placeholder="Seleccionado(s)" size="small" />
                )}
                sx={{ width: "100%", marginBottom: 2 }}
                onChange={(event, newValue) => {
                  setOriginId(newValue?.id ?? 0);
                }}
              />

              <TextField
                id="simple-incoming-flight"
                size="small"
                label="Vuelo Origen"
                variant="outlined"
                sx={{ width: "100%", marginBottom: 2 }}
                value={incomingFlight}
                onChange={(event) => setIncomingFlight(event.target.value)}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Horario Llegada"
                  value={estimatedTimeArrival}
                  onChange={(newValue) => setEstimatedTimeArrival(newValue)}
                  format="YYYY-MM-DD HH:mm"
                  sx={{ "& .MuiOutlinedInput-input": { padding: "10px" }, marginBottom: 2, width: "100%" }}
                />
              </LocalizationProvider>

              <Autocomplete
                id="simple-conveyor"
                options={conveyorList}
                getOptionLabel={(option) => option?.description ?? "" }
                renderInput={(params) => (
                  <TextField {...params} label="Banda" placeholder="Seleccionado(s)" size="small" />
                )}
                sx={{ width: "100%", marginBottom: 2 }}
                onChange={(event, newValue) => {
                  if(newValue){
                    setConveyorId(newValue.id);
                  } else {
                    setConveyorId(null);
                  }
                }}
              />
            </Grid>
            <Grid item sm={6}>
            <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "#E6FFE7" }} aria-label="recipe" variant="rounded">
                    <FlightTakeoff sx={{ color: "#49B44E" }} fontSize="small" />
                  </Avatar>
                }
                title={
                  <Typography variant="button" display="block">
                    Salida
                  </Typography>
                }
                sx={{ padding: 0, bgcolor: "#F9F9F9", marginBottom: 2 }}
              />

              <Autocomplete
                id="simple-destiny"
                options={(dataFilters?.airports ?? []) as filterData[]}
                getOptionLabel={(option) => option?.description ?? "" }
                renderInput={(params) => (
                  <TextField {...params} label="Destino" placeholder="Seleccionado(s)" size="small" />
                )}
                sx={{ width: "100%", marginBottom: 2 }}
                onChange={(event, newValue) => {
                  setDestinyId(newValue?.id ?? 0);
                }}
              />

              <TextField
                id="simple-outgoing-flight"
                size="small"
                label="Vuelo Destino"
                variant="outlined"
                sx={{ width: "100%", marginBottom: 2 }}
                value={outgoingFlight}
                onChange={(event) => setOutgoingFlight(event.target.value)}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Horario Salida"
                  value={estimatedTimeDeparture}
                  onChange={(newValue) => setEstimatedTimeDeparture(newValue)}
                  format="YYYY-MM-DD HH:mm"
                  sx={{ "& .MuiOutlinedInput-input": { padding: "10px" }, marginBottom: 2, width: "100%" }}
                />
              </LocalizationProvider>

              <TextField
                id="simple-boarding-gate"
                size="small"
                label="Puerta Embarque"
                variant="outlined"
                sx={{ width: "100%", marginBottom: 2 }}
                value={boardingGate}
                onChange={(event) => setBoardingGate(event.target.value)}
              />
            </Grid>
          </Grid>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              startIcon={<ConnectingAirports />}
              onClick={() => handleSendData({
                serviceTypeId,
                incomingFlight: incomingFlight.trim(),
                outgoingFlight: outgoingFlight.trim(),
                aircraftTypeId,
                estimatedTimeArrival: dayjs(estimatedTimeArrival).tz("America/Bogota").subtract(5, "hour"),
                estimatedTimeDeparture: dayjs(estimatedTimeDeparture).tz("America/Bogota").subtract(5, "hour"),
                terminal: terminal.trim(),
                observation,
                baseId,
                airlineId,
                registrationId,
                originId,
                destinyId,
                gateId,
                conveyorId,
                boardingGate: boardingGate.trim(),
                user: user.employeeId })
              }
            >
              {ACTIONS.CONTINUE}
            </Button>
          </div>
        </Box>
      </Box>
    </Drawer>
  );
}

export default ItineraryAdd;
