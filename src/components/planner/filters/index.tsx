import React, { useState } from "react";
import { Box, Button, Drawer, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, Select, Typography } from "@mui/material";
import { Close, FilterAlt } from "@mui/icons-material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { Dayjs } from "dayjs";
import dayjs  from "dayjs";

import { FilterProps } from "./interface";
import { ACTIONS } from "../../../shared/constants";

const PlannerFilters: React.FC<FilterProps> = ({ open, handleClose, handleFilter, airports }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [base, setBase] = useState<string>(airports.id);
  const [company, setCompany] = useState<any[]>([]);

  const resetStates = () => {
    setBase(airports.id);
    setCompany([]);
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

          <FormControl sx={{ width: '100%', mb: 3 }} size="small">
            <InputLabel id="label-base">Base</InputLabel>
            <Select
              labelId="label-base"
              id="simple-base"
              value={base}
              label="Base"
            >
              <MenuItem key={airports.id} value={airports.id}>
                {airports.description}
              </MenuItem>
            </Select>
          </FormControl>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              startIcon={<FilterAlt />}
              onClick={() => handleFilter({ 
                startDate,
                endDate,
                baseId: String(base)
              }) }
            >
              {ACTIONS.FILTER}
            </Button>
          </div>
        </Box>
      </Box>
    </Drawer>
  );
}

export default PlannerFilters;
