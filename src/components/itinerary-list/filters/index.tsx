import React, { useState } from "react";
import { Autocomplete, Box, Button, Chip, Drawer, Grid, IconButton, List, ListItem, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { Close, FilterAlt, FilterAltOff } from "@mui/icons-material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { Dayjs } from "dayjs";
import dayjs  from "dayjs";

import { FilterProps } from "./interface";
import { filterData } from "../interface";
import { ACTIONS, TITLES } from "../../../shared/constants";


const ItineraryFilters: React.FC<FilterProps> = ({ open, handleClose, dataFilters, operation, handleFilter }) => {

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [base, setBase] = useState<any[]>([]);
  const [company, setCompany] = useState<any[]>([]);
  const [aircraft, setAircraft] = useState<any[]>([]);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [inputValueIn, setInputValueIn] = useState<string>("");
  const [inputValueOut, setInputValueOut] = useState<string>("");
  const [incomingFlightNumber, SetIncomingFlightNumber] = useState<string[]>([]);
  const [outgoingFlightNumber, SetOutgoingFlightNumber] = useState<string[]>([]);

  const handleIncomingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueIn(event.target.value);
  };

  const handleIncomingKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValueIn.trim() !== "") {
      SetIncomingFlightNumber([...incomingFlightNumber, inputValueIn.trim()]);
      setInputValueIn("");
    }
  };

  const handleOutgoingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueOut(event.target.value);
  };

  const handleOutgoingKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValueOut.trim() !== "") {
      SetOutgoingFlightNumber([...outgoingFlightNumber, inputValueOut.trim()]);
      setInputValueOut("");
    }
  };

  const handleDeleteTag = (flight: string, type: boolean) => {
    if(type){
      SetIncomingFlightNumber(incomingFlightNumber.filter((f) => f !== flight));
    } else {
      SetOutgoingFlightNumber(outgoingFlightNumber.filter((f) => f !== flight));
    }
  };

  const defaultAirport = ((dataFilters?.airports ?? []) as filterData[]).find((bid) => bid.id === operation);

  const resetStates = () => {
    setBase([defaultAirport]);
    setCompany([]);
    setAircraft([]);
    setServiceTypes([]);
    SetIncomingFlightNumber([]);
    SetOutgoingFlightNumber([]);
    setStartDate(dayjs());
    setEndDate(dayjs());
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => handleClose(false)} PaperProps={{ sx: { width: "35%" } }} >
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
              primary={ACTIONS.FILTER.toUpperCase()}
            />
          </ListItem>
        </List>

        <Box margin={2}>
          <Grid container spacing={2}>
            <Grid item sm={6}>
              <Typography variant="caption" display="block" gutterBottom>
                Desde
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="start date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  format="YYYY-MM-DD"
                  sx={{ "& .MuiOutlinedInput-input": { padding: "10px" }, marginBottom: 2 }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="caption" display="block" gutterBottom>
                Hasta
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="end date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  format="YYYY-MM-DD"
                  sx={{ "& .MuiOutlinedInput-input": { padding: "10px" }, marginBottom: 2 }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Autocomplete
            multiple
            limitTags={2}
            id="multiple-base"
            options={ (dataFilters?.airports ?? []) as filterData[] }
            getOptionLabel={(option) => (option ? option.description ?? "" : "")}
            defaultValue={[defaultAirport]}
            renderInput={(params) => (
              <TextField {...params} label="Base" placeholder="Seleccionado(s)" size="small" />
            )}
            sx={{ width: "100%", marginBottom: 2 }}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            onChange={(event, newValue) => {
              setBase(newValue);
            }}
          />

          <Autocomplete
            multiple
            limitTags={2}
            id="multiple-airlines"
            options={(dataFilters?.airlines ?? []) as filterData[]}
            getOptionLabel={(option) => option.extra ?? "" }
            renderInput={(params) => (
              <TextField {...params} label={TITLES.CUSTOMERS} placeholder="Seleccionado(s)" size="small" />
            )}
            sx={{ width: "100%", marginBottom: 2 }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={company ?? []}
            onChange={(event, newValue) => {
              setCompany(newValue);
            }}
          />

          {/* <Autocomplete
            multiple
            limitTags={2}
            id="multiple-airports"
            options={(dataFilters?.airports ?? []) as filterData[]}
            getOptionLabel={(option) => option.description ?? "" }
            renderInput={(params) => (
              <TextField {...params} label="Aeropuertos" placeholder="Seleccionado(s)" size="small" />
            )}
            sx={{ width: "100%", marginBottom: 2 }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          /> */}

          <Autocomplete
            multiple
            limitTags={2}
            id="multiple-aircraft-type"
            options={(dataFilters?.aircraftTypes ?? []) as filterData[]}
            getOptionLabel={(option) => option.description ?? "" }
            renderInput={(params) => (
              <TextField {...params} label="Tipo de Aeronave" placeholder="Seleccionado(s)" size="small" />
            )}
            sx={{ width: "100%", marginBottom: 2 }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={aircraft ?? []}
            onChange={(event, newValue) => {
              setAircraft(newValue);
            }}
          />

          <Autocomplete
            multiple
            limitTags={2}
            id="multiple-service-type"
            options={(dataFilters?.serviceTypes ?? []) as filterData[]}
            getOptionLabel={(option) => option.description ?? "" }
            renderInput={(params) => (
              <TextField {...params} label="Tipo de Servicio" placeholder="Seleccionado(s)" size="small" />
            )}
            sx={{ width: "100%", marginBottom: 2 }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={serviceTypes ?? []}
            onChange={(event, newValue) => {
              setServiceTypes(newValue);
            }}
          />

          <Box display="flex" alignItems="center" marginBottom={2}>
            <TextField
              label="#Llegada"
              variant="outlined"
              size="small"
              value={inputValueIn}
              onChange={handleIncomingChange}
              onKeyPress={handleIncomingKeyPress}
              sx={{marginRight: 2, width: "30%"}}
            />
            <Stack direction="row" spacing={1} marginTop={1}>
              {incomingFlightNumber.map((flight, index) => (
                <Chip
                  key={index}
                  label={flight}
                  onDelete={() => handleDeleteTag(flight, true)}
                />
              ))}
            </Stack>
          </Box>

          <Box display="flex" alignItems="center" marginBottom={2}>
            <TextField
              label="#Salida"
              variant="outlined"
              size="small"
              value={inputValueOut}
              onChange={handleOutgoingChange}
              onKeyPress={handleOutgoingKeyPress}
              sx={{marginRight: 2, width: "30%"}}
            />
            <Stack direction="row" spacing={1} marginTop={1}>
              {outgoingFlightNumber.map((flight, index) => (
                <Chip
                  key={index}
                  label={flight}
                  onDelete={() => handleDeleteTag(flight, false)}
                />
              ))}
            </Stack>
          </Box>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              startIcon={<FilterAlt />}
              onClick={() => handleFilter({ 
                startDate,
                endDate,
                base,
                company,
                aircraft,
                serviceTypes,
                incomingFlightNumber,
                outgoingFlightNumber
              }) }
            >
              {ACTIONS.FILTER}
            </Button>

            <IconButton aria-label="clean" color="secondary" onClick={resetStates}>
              <FilterAltOff />
            </IconButton>
          </div>
        </Box>
      </Box>
    </Drawer>
  );
}

export default ItineraryFilters;
