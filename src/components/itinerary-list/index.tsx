import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Avatar, Button, CardHeader, Divider, Grid, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material";
import { Add, FilterAlt, LocalAirport, Refresh, SaveAlt } from "@mui/icons-material";

import { AgGridReact } from "ag-grid-react";
import { GridApi, IRowNode } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "../../shared/locale";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import moment from "moment-timezone";

import { getUser } from "../../shared/auth-service";
import { filterAll, filterData } from "./interface";
import { getItineraryFilters, getItineraryRecords, deleteItinerary } from "./logic";

import ItineraryAdd from "./add";
import ItineraryDetails from "./details";
import ItineraryFilters from "./filters";

import BackDrop from "../../shared/fragments/backdrop";
import SplitButton from "../../shared/fragments/split-button-itinerary";
import MessageSnackbar from "../../shared/fragments/message-snackbar";
import MenuConfig from "../../shared/fragments/menu-config-itinerary";
import ItineraryTransfer from "./transfer";
import AcceptDialog from "../accept-modal";

const user = getUser();

const ItineraryList: React.FC = () => {
  const [myBase] = useState((user && user.operationAirportId == 27) ? 3 : user.operationAirportId);

  const [rowData, setRowData] = useState<any[]>([]);
  const [filters, setFilters] = useState<filterAll>();
  const [loading, setLoading] = useState<boolean>(true);
  const [openFilters, setOpenFilters] = useState<boolean>(false);
  const [params, setParams] = useState<Record<string, any>>({});
  const [deleteId, setDeleteId] = useState<number>(0);
  const [load, setLoad] = useState<boolean>(false);

  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [details, setDetails] = useState<any[]>([]);

  const [openNew, setOpenNew] = useState<boolean>(false);
  const [openMessage, setOpenMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const [openTrasfer, setOpenTrasfer] = useState<boolean>(false);
  const [selectedTrasfer, setSelectedTrasfer] = useState<any[]>([]);

  // config grid
  const [prepare, setPrepare] = useState<boolean>(false);
  const [selection, setSelection] = useState<boolean>(false);
  const [dataConfig, setDataConfig] = useState<any>({prepare: prepare, selection: selection});
  const gridRef = useRef<AgGridReact>(null);

  const startOfDay = moment().tz("America/Bogota").startOf("day").format();
  const endOfDay = moment().tz("America/Bogota").endOf("day").format();

  // initial load
  useEffect(() => {
    async function fetchData() {
      if (loading) {
        try {
          if(filters === undefined){
            const filterList = await getItineraryFilters();
            setFilters(filterList);
          }

          const dataParams = {
            Start: startOfDay,
            End: endOfDay,
            Base: [{id: myBase}]
          };

          const recordsList = await getItineraryRecords(dataParams);
          setRowData(recordsList.data);
          setLoading(false);

          // setTimeout(() => {
          //   setOpenMessage(false);
          // }, 5500);

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


  // Load
  const handleLoad = (filterData: Record<string, any>) => {
    if(filterData.base.length < 1){ filterData.base.push({id: myBase}); }

    filterData.Start = moment(String(filterData.startDate)).tz("America/Bogota").startOf("day").format();
    filterData.End = moment(String(filterData.endDate)).tz("America/Bogota").endOf("day").format();

    delete filterData.startDate;
    delete filterData.endDate;

    setParams(filterData);
    setLoad(true);
    setOpenFilters(false);
  };


  // Filter
  const handleDrawer = () => {
    setOpenFilters(!openFilters);
  }

  const handleReload = () => {
    setLoading(true);
  }


  // Add Itineraty
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
    setOpenMessage(true);
    setLoading(true);
  }


  // Details
  const handleOpenDetail = () => {
    setOpenDetails(!openDetails);
  }

  const handleDetailData = (data: any) => {
    setDetails(data);
    handleOpenDetail();
  }

  const handleDeleteDetail = (data: any) => {
    setOpenAlert(true);
    setDeleteId(data.itineraryElementId);
  }

  const handleDelete = async () => {
    setOpenAlert(false);
    const delItinerary = await deleteItinerary({
      elementItineraryId: deleteId,
      user: user.employeeId
    });

    setMessage("Se elimino el registro de itinerario");
    setLoading(true);
    setOpenMessage(true);
  }


  // Transfer
  const handleOpenTrasfer = () => {
    if(selectedTrasfer.length < 1){
      alert("Sin Vuelos");
      return false;
    }

    setOpenTrasfer(!openTrasfer);
  }

  const handleTransfer = (data: any) => {
    setOpenTrasfer(!openTrasfer);
    setMessage("Transferencia completa.");
    setOpenMessage(true);
    setLoading(true);
    setSelectedTrasfer([]);
  }


  // AgGrid
  const onGridReady = (params: { api: GridApi }) => {
    setGridApi(params.api);
  };

  const onFilterTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (gridApi) { gridApi.setGridOption("quickFilterText", event.target.value); }
  };

  const handleExport = useCallback(() => {
    gridRef.current!.api.exportDataAsCsv();
  }, []);


  const localeText = useMemo<{ [key: string]: string; }>(() => {
    return AG_GRID_LOCALE_ES;
  }, []);


  // Additional column functions
  const formatDate = (params: any) => {
    return moment.tz(params, "America/Bogota").format("YYYY-MM-DD HH:mm");
  };

  const formatCompany = (params: any) => {
    const dataFilters = (filters?.airlines ?? []) as filterData[];
    const myCompany = dataFilters.find((company: any) => company.id === params);
    return myCompany?.extra;
  };

  const formatLogo = (params: any) => {
    return (
      <span style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 6}} >
        {params.value && (
          <img
            alt={`${params.value} Flag`}
            src={`https://content.airhex.com/content/logos/airlines_${params.value}_23_23_s.png`}
          />
        )}
      </span>
    );
  };

  const handleConfigAction = (data: any) => {
    if(data.prepare != undefined){ setPrepare(!data.prepare); }
    if(data.selection != undefined){ setSelection(data.selection); }
    setDataConfig(data);
  };

  const isRowSelectable = useCallback((params: IRowNode<any>) => {
    return !!params.data && params.data.serviceHeaderId === null;
  }, []);

  const onSelectionChanged = (event: any) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedTrasfer(selectedRows);
  };

  const columnData: any = [
    //{ headerName: "Preparar", field: "preparar", hide: !prepare },
    {
      headerName: "Id",
      field: "itineraryElementId",
      width: 125,
      resizable: false,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      showDisabledCheckboxes: false,
    },
    { headerName: "Base", field: "base.description", width: 120 },
    { 
      headerName: "",
      field: "company.description",
      cellRenderer: formatLogo,
      width: 50,
      filter: false
    },
    { headerName: "Compañía", field: "company.id", valueFormatter: (p: any) => formatCompany(p.value) },
    { headerName: "Origen", field: "origin.description", width: 100 },
    { headerName: "Núm. Vuelo", field: "incomingFlight", width: 130 },
    { headerName: "ETA", field: "sta", valueFormatter: (p: any) => formatDate(p.value) },
    { headerName: "Destino", field: "destiny.description", width: 100 },
    { headerName: "Núm. Vuelo", field: "outgoingFlight", width: 130 },
    { headerName: "ETD", field: "std", valueFormatter: (p: any) => formatDate(p.value) },
    { headerName: "Servicio", field: "serviceType.description" },
    { headerName: "Cód.CIO", field: "serviceHeaderId" },
    { 
      headerName: "Actions", 
      field: "actions", 
      cellRenderer: SplitButton,
      cellRendererParams: {
        handleDetail: handleDetailData
      },
      width: 130,
      resizable: false
    }
  ];

  if(openMessage){
    setTimeout(() => { setOpenMessage(false); }, 5500);
  }

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

      <ItineraryDetails
        open={openDetails}
        handleClose={setOpenDetails}
        data={details}
        handleDelete={handleDeleteDetail}
      />

      { openMessage && <MessageSnackbar message={message} /> }

      { openTrasfer && <ItineraryTransfer
          data={selectedTrasfer}
          handleTransferSave={handleTransfer}
          handleTransferClose={handleOpenTrasfer}
        />
      }

      { openAlert && <AcceptDialog
        handleAccept={handleDelete}
        handleClose={() => setOpenAlert(false)}
        dialogContentText={"¿Confirma eliminar el registro de itinerario?"}
        dialogTitle={"Eliminar Itinerario"}
        open={openAlert}
      />}

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

        <Grid item xs={7} md={8} mt={1}>
          <Button
            startIcon={<Add />}
            sx={{borderRadius: 10, bgcolor: "#FFFFFF" }}
            variant="outlined"
            onClick={handleOpenAdd}
          >
            Agregar
          </Button>

          <Button
            sx={{borderRadius: 10, bgcolor: "#FFFFFF" }}
            variant="outlined"
            onClick={handleOpenTrasfer}
          >
            Transfer
          </Button>
        </Grid>

        <Grid item xs={5} md={4} justifyItems={"end"}>
          <Paper
            component="form"
            sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%", borderRadius: 10, justifyContent: "space-between" }}
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
              <IconButton sx={{ p: "10px" }} aria-label="save" color="success" onClick={handleExport} >
                <SaveAlt />
              </IconButton>
            </Tooltip>

            <MenuConfig
              params={dataConfig}
              handleConfigAction={handleConfigAction}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} mb={2}>
          <Divider sx={{ margin: 2 }}/>

          <div
            className="ag-theme-quartz"
            style={{ height: 500 }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnData}
              onGridReady={onGridReady}
              localeText={localeText}
              defaultColDef={{
                sortable: true,
                filter: true
              }}
              enableCellTextSelection={selection}
              suppressRowClickSelection={true}
              rowSelection={"multiple"}
              isRowSelectable={isRowSelectable}
              onSelectionChanged={onSelectionChanged}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default ItineraryList;