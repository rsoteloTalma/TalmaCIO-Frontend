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


const ItineraryDetails: React.FC<FilterProps> = ({ open, handleClose, dataFilters, base, handleFilter }) => {

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [bases, setBases] = useState<any[]>([]);
  const [company, setCompany] = useState<any[]>([]);
  const [aircraft, setAircraft] = useState<any[]>([]);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [inputValueIn, setInputValueIn] = useState<string>("");
  const [inputValueOut, setInputValueOut] = useState<string>("");
  const [incomingFlightNumber, SetIncomingFlightNumber] = useState<string[]>([]);
  const [outgoingFlightNumber, SetOutgoingFlightNumber] = useState<string[]>([]);


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
              primary="Itinerario #"
            />
          </ListItem>
        </List>

        <Box margin={2}>

        </Box>
      </Box>
    </Drawer>
  );
}

export default ItineraryDetails;
