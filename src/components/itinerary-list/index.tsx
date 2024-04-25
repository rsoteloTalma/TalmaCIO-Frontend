import React, { useState, useEffect } from "react";
import { Avatar, Button, CardHeader, Divider, Grid, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material";
import { Add, FilterAlt, LocalAirport, Refresh, SaveAlt } from "@mui/icons-material";

import { AgGridReact } from "ag-grid-react";
import { GridApi } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import moment from "moment-timezone";

import { getUser } from "../../shared/auth-service";
import { filterAll } from "./interface";
import { getItineraryFilters, getItineraryRecords } from "./logic";

import ItineraryFilters from "./filters";
import ItineraryAdd from "./add";
import BackDrop from "../../shared/fragments/backdrop";
import SplitButton from "../../shared/fragments/split-button";
import MessageSnackbar from "../../shared/fragments/message-snackbar";

const user = getUser();

const ItineraryList: React.FC = () => {
  const myBase = (user && user.operationAirportId == 27) ? 3 : user.operationAirportId;

  const [rowData, setRowData] = useState<any[]>([]);
  const [filters, setFilters] = useState<filterAll>();
  const [loading, setLoading] = useState<boolean>(true);
  const [openFilters, setOpenFilters] = useState<boolean>(false);
  const [params, setParams] = useState<Record<string, any>>({});
  const [load, setLoad] = useState<boolean>(false);

  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  //const [openDetails, setOpenDetails] = useState<boolean>(false);

  const [openNew, setOpenNew] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const startOfDay = moment().tz("America/Bogota").startOf("day").format();
  const endOfDay = moment().tz("America/Bogota").endOf("day").format();

  // initial load
  useEffect(() => {
    async function fetchData() {
      if (loading) {
        try {
          const filterList = await getItineraryFilters();
          setFilters(filterList);

          const dataParams = {
            Start: startOfDay,
            End: endOfDay,
            Base: [{id: myBase}]
          };

          const recordsList = await getItineraryRecords(dataParams);
          setRowData(recordsList.data);
          setLoading(false);

        } catch (error) {
          setLoading(false);
          setRowData([]);
        }
      }
    }
    fetchData();
  }, [loading]);

  // filter
  useEffect(() => {
    async function fetchData() {
      if (load) {
        try {
          const recordsList = await getItineraryRecords(params);
          setRowData(recordsList.data);
          setLoad(false);

        } catch (error) {
          setLoad(false);
          setRowData([]);
        }
      }
    }
    fetchData();
  }, [load]);

  const handleDrawer = () => {
    setOpenFilters(!openFilters);
  }

  const handleLoad = (filterData: Record<string, any>) => {
    if(filterData.base.length < 1){
      const myBase = user.setAirports.find((bId: any) => bId.id === user.operationAirportId);
      filterData.base.push(myBase);
    }

    filterData.Start = moment(String(filterData.startDate)).tz("America/Bogota").startOf("day").format();
    filterData.End = moment(String(filterData.endDate)).tz("America/Bogota").endOf("day").format();

    delete filterData.startDate;
    delete filterData.endDate;

    setParams(filterData);
    setLoad(true);
    setOpenFilters(false);
  };

  const handleReload = () => {
    setLoading(true);
  }

  // New Itineraty
  const handleOpenAdd = () => {
    setOpenNew(!openNew);
  }

  const handleAdd = (data: any) => {
    let message = "";

    if(data.success == 1){
      message = data.data;
    } else {
      if(data.errors && data.errors.length > 0){
        message = data.errrors[0];

      } else if(data.message && data.message !== ""){
        message = data.message;
      }
    }
    setMessage(message);
    setOpenAlert(true);
    setLoading(true);
  }

  // AgGrid
  const onGridReady = (params: { api: GridApi }) => {
    setGridApi(params.api);
  };

  const onFilterTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (gridApi) { gridApi.setGridOption("quickFilterText", event.target.value); }
  };

  // additional column functions
  const formatDate = (params: any) => {
    return moment.tz(params, "America/Bogota").format("YYYY-MM-DD HH:mm");
  };

  const columnData: any = [
    { headerName: "Id", field: "itineraryElementId", width: 110, resizable: false },
    { headerName: "Base", field: "base.description", width: 120 },
    { headerName: "Compañia", field: "company.description" },
    { headerName: "Origen", field: "origin.description", width: 100 },
    { headerName: "Núm. Vuelo", field: "incomingFlight", width: 130 },
    { headerName: "ETA", field: "sta", valueFormatter: (p: any) => formatDate(p.value) },
    { headerName: "Destino", field: "destiny.description", width: 100 },
    { headerName: "Núm. Vuelo", field: "outgoingFlight", width: 130 },
    { headerName: "ETD", field: "std", valueFormatter: (p: any) => formatDate(p.value) },
    { headerName: "Servicio", field: "serviceType.description" },
    { 
      headerName: "Actions", 
      field: "actions", 
      cellRenderer: SplitButton,
      width: 130,
      resizable: false
    }
  ];

  if (loading) return (<BackDrop />);
  if (load) return (<BackDrop />);

  return (
    <>
      <ItineraryFilters
        open={openFilters}
        handleClose={setOpenFilters}
        dataFilters={filters}
        operation={myBase}
        handleFilter={handleLoad}
      />

      <ItineraryAdd
        open={openNew}
        handleClose={setOpenNew}
        dataFilters={filters}
        handleAdd={handleAdd}
      />

      { openAlert && <MessageSnackbar message={message} /> }

      <Grid container sx={{ background: "#FAFAFA" }} paddingX={2}>
        <Grid item xs={12}>
          <CardHeader 
            avatar={
              <Avatar sx={{ bgcolor: "#D6F4FF" }} aria-label="recipe" variant="rounded">
                <LocalAirport sx={{ color: "#00B0EF" }} fontSize="small" />
              </Avatar>
            }
            title={
              <Typography sx={{ color: "#1A3072" }} variant="button" display="block">
                Itinerario
              </Typography>
            }
            subheader="Itinerario Registrado"
            sx={{ paddingLeft: 0 }}
          />
        </Grid>

        <Grid item xs={8} mt={1}>
          <Button
            startIcon={<Add />}
            sx={{borderRadius: 10, bgcolor: "#FFFFFF" }}
            variant="outlined"
            onClick={handleOpenAdd}
          >
            Agregar
          </Button>
        </Grid>

        <Grid item xs={4} justifyItems={"end"}>
          <Paper
            component="form"
            sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400, borderRadius: 10, justifyContent: "space-between" }}
          >
            <Tooltip title="Reestablecer datos">
              <IconButton sx={{ p: "10px" }} aria-label="refresh" onClick={handleReload}>
                <Refresh />
              </IconButton>
            </ Tooltip>

            <Tooltip title="Filtrar">
              <IconButton sx={{ p: "10px" }} aria-label="filter" color="primary" onClick={handleDrawer}>
                <FilterAlt />
              </IconButton>
            </Tooltip>

            <Divider sx={{ height: 28, marginX: 1 }} orientation="vertical" />

            <TextField
              type="text"
              onChange={onFilterTextChange}
              size="small"
              variant="outlined"
              placeholder="Filtro rápido..."
            />

            <Divider sx={{ height: 28, marginX: 1 }} orientation="vertical" />

            <Tooltip title="Descargar">
              <IconButton sx={{ p: "10px" }} aria-label="save" color="success" >
                <SaveAlt />
              </IconButton>
            </Tooltip>
          </Paper>
        </Grid>

        <Grid item xs={12} mb={2}>
          <Divider sx={{ margin: 2 }}/>

          <div
            className="ag-theme-quartz"
            style={{ height: 500 }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnData}
              onGridReady={onGridReady}
              defaultColDef={{
                sortable: true,
                filter: true,
                //flex: 1,
              }}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default ItineraryList;