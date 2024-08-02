import React, { useEffect, useRef, useState } from "react";
import { Alert, Autocomplete, Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, List, ListItem, ListItemText, TextField, Tooltip } from "@mui/material";
import { Add, Check, Close, DeleteOutline } from "@mui/icons-material";

import { AgGridReact } from "ag-grid-react";
import { GridApi, RowDragEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

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

import { ValidateLeaders, Sequences } from "./logic";
import { SequenceProps } from "./interface";

import { ACTIONS } from "../../../shared/constants";
import { getUser } from "../../../shared/auth-service";
import { getPlannerByServiceHeader } from "../logic";

const user = getUser();

const PlannerSequences: React.FC<SequenceProps> = ({ open, data, gate, leadersList, handleClose, handleSequences }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [enableEdit, setEnableEdit] = useState<boolean>(false);

  const [serviceHeaderId, setServiceHeaderId] = useState<number>(data.serviceHeaderId ?? 0);
  const [rowDataSeq, setRowDataSeq] = useState<any[]>([]);
  const [leaderstList, setLeaderstList] = useState<any[]>([]);
  const [gateList, setGateList] = useState<any[]>([]);
  const [serviceTypeList, setServiceTypeList] = useState<any[]>([
    { id: 2, description: "ULTIMO VUELO" },
    { id: 3, description: "LIMPIEZA TERMINAL (PCTA)" },
    { id: 4, description: "PRIMER VUELO" },
  ]);

  // agGrid
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const gridRef = useRef<AgGridReact>(null);

  // new
  const [leaderId, setLeaderId] = useState<number | null>(null);
  const [leaderDescription, setLeaderDescription] = useState<string | null>(null);
  const [timeArrival, setTimeArrival] = useState<Dayjs | null>(null);
  const [timeDeparture, setTimeDeparture] = useState<Dayjs | null>(null);
  const [gateId, setGateId] = useState<number | null>(null);
  const [gateDescription, setGateDescription] = useState<string | null>(null);
  const [serviceTypeStageId, setServiceTypeStageId] = useState<number | null>(null);
  const [serviceTypeStage, setServiceTypeStage] = useState<string | null>(null);

  const [checkServiceType, setCheckServiceType] = useState<boolean>(true);

  // validate
  const [messageValidate, setMessageValidate] = useState<string>("");
  const [openValLeader, setOpenValLeader] = useState<boolean>(false);
  const [minTime, setMinTime] = useState<Dayjs>(dayjs());
  const [maxTime, setMaxTime] = useState<Dayjs>(dayjs());

  const minDateTime = dayjs(minTime);
  const maxDateTime = dayjs(maxTime);

  // load
  useEffect(() => {
    async function fetchData() {
      if (loading) {

        try {
          const getPlanner = await getPlannerByServiceHeader({serviceHeaderId});

          if(getPlanner.length > 0){
            setRowDataSeq(getPlanner[0].sequences);

            setTimeArrival(dayjs(getPlanner[0].sta));
            setTimeDeparture(dayjs(getPlanner[0].std));
            setMinTime(getPlanner[0].sta);
            setMaxTime(getPlanner[0].std);

            const filtered = leadersList.filter((item: any) => item.extra === "96");
            setLeaderstList(filtered);

            const newGate = gate.map((item: any) => ({
              id: item.value,
              description: item.label,
            }));
            setGateList(newGate);

            const typeList = getPlanner[0].sequences.some((element: any) => element.serviceTypeStageId === 1);
            setCheckServiceType(typeList);
          }
          setLoading(false);

        } catch (error) {
          setCheckServiceType(false);
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [loading]);


  // Process
  // Return To Grid
  const handleSendData = async (params: any[]) => {
    const data = {
      serviceHeaderId,
      employeeId: user.employeeId,
      sequences: rowDataSeq
    };

    const sendData = await Sequences(data);
    const response = {
      success: (sendData.success > 0) ? true: false,
      message: sendData.message
    };

    handleSequences(response);
    setShowBackdrop(false);
    handleClose(false);
  }

  if (Object.keys(data).length === 0) { return false; }

  // Sequences
  const handleValidation = async () => {
    setOpenValLeader(false);
    const validate = await ValidateLeaders(rowDataSeq, minTime, maxTime);

    if(!validate.success){
      setOpenValLeader(true);
      setMessageValidate(validate.message);
      return false;
    }

    setShowBackdrop(true);
    handleSendData(rowDataSeq);
  };

  const handleAddData = (params: Record<string, any>) => {
    const seq = (rowDataSeq.length - 1);
    const slot = (rowDataSeq[seq].slotSequence + 1);

    if(!params.gateId){
      params.gateId = (rowDataSeq[seq].gateId);
      params.gateDescription = (rowDataSeq[seq].gate);
    }

    if(checkServiceType){
      params.serviceTypeStageId = rowDataSeq[seq].serviceTypeStageId;
      params.serviceTypeStage = rowDataSeq[seq].serviceTypeStage;
    }

    if (dayjs(params.timeArrival).isBefore(minDateTime)) {
      setMessageValidate(`El horario de inicio está por debajo del STA permitido (${data.sta.slice(11,16)}).`);
      setOpenValLeader(true);
      return false;
    } else if (dayjs(params.timeDeparture).isAfter(maxDateTime)) {
      setMessageValidate(`El horario de finalización está sobre el STD permitido (${data.std.slice(11,16)}).`);
      setOpenValLeader(true);
      return false;
    }

    const add = {
      slotSequence: slot,
      gateId: params.gateId,
      gate: params.gateDescription,
      serviceTypeStageId: params.serviceTypeStageId,
      serviceTypeStage: params.serviceTypeStage,
      ghLeaderId: params.leaderId,
      ghLeader: params.leaderDescription,
      startDate: params.timeArrival,
      endDate: params.timeDeparture
    };

    setOpenValLeader(false);
    setRowDataSeq([...rowDataSeq, add]);
    setEnableEdit(true);
  };

  const handleDeleteData = (slot: number) => {
    const removeSlot = rowDataSeq.filter(item => item.slotSequence !== slot);

    if(removeSlot.length < 1){
      alert("No se pueden remover todas las secuencias.");
      return false;
    }

    setRowDataSeq(removeSlot);
  };

  const onRowDragEnd = (event: RowDragEvent) => {
    const allRows: any[] = [];
    event.api.forEachNode((node) => {
      if (node.data) {
        allRows.push(node.data);
      }
    });

    //console.log("Nuevo orden de filas:", allRows);
    setRowDataSeq(allRows);
  };


  // agGrid
  const onGridReady = (params: { api: GridApi }) => {
    setGridApi(params.api);
  };

  const formatDate = (params: any) => {
    return dayjs(params).tz("America/Bogota").format("YYYY-MM-DD HH:mm");
  };

  const ActionButton: React.FC = (params: any) => {
    const { data } = params;

    return (
      <Tooltip title="Eliminar secuencia">
        <IconButton sx={{ mt: "-5px" }} aria-label="delete" onClick={() => handleDeleteData(data.slotSequence)}>
          <DeleteOutline fontSize="small" color="error" />
        </IconButton>
      </ Tooltip>
    );
  };


  const columnData: any = [
    {
      headerName: "Id",
      field: "slotSequence",
      width: 70,
      filter: false,
      rowDrag: true,
      // pinned: true
    },
    { headerName: "Leader", field: "ghLeader", width: 210, filter: false },
    { headerName: "Inicio", field: "startDate", width: 150, valueFormatter: (p: any) => formatDate(p.value), filter: false },
    { headerName: "Final", field: "endDate", width: 150, valueFormatter: (p: any) => formatDate(p.value), filter: false },
    { headerName: "Tipo Srv.", field: "serviceTypeStage", width: 140, filter: false },
    { headerName: "Parking", field: "gate", width: 90, filter: false },
    {
      headerName: "Action",
      field: "slotSequence",
      cellRenderer: ActionButton,
      width: 75,
      filter: false,
      resizable: false
    }
  ];

  return (
    <Drawer anchor="right" open={open} onClose={() => handleClose(false)} PaperProps={{ sx: { width: "60%" } }} >
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
              primary={`SECUENCIAS - ${serviceHeaderId}`}
            />
          </ListItem>
        </List>

        <Box margin={2}>
        { loading ? (
          <center>
            <CircularProgress />
          </center>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item sm={12}>
                <div className="ag-theme-quartz" >
                  <AgGridReact
                    ref={gridRef}
                    rowData={rowDataSeq}
                    columnDefs={columnData}
                    onGridReady={onGridReady}
                    defaultColDef={{
                      sortable: true,
                      filter: true
                    }}
                    rowDragManaged={true}
                    domLayout={"autoHeight"}
                    onRowDragEnd={onRowDragEnd}
                  />
                </div>
              </Grid>
            </Grid>

            {openValLeader ? (
              <Alert severity="error" sx={{ marginY: 2 }} onClose={() => setOpenValLeader(false)}>
                { messageValidate }
              </Alert>
            ) : (
              <Alert severity="info" sx={{ marginY: 2 }}>
                Debe existir mínimo un líder asignado.
              </Alert>
            )}

            <Grid container spacing={2} mt={1}>
              <Grid item sm={12}>
                <Autocomplete
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
                />
              </Grid>

              <Grid item sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Horario Inicio"
                    value={timeArrival}
                    onChange={(newValue) => setTimeArrival(newValue)}
                    minDateTime={minDateTime}
                    maxDateTime={maxDateTime}
                    format="YYYY-MM-DD HH:mm"
                    sx={{ "& .MuiOutlinedInput-input": { padding: "10px" }, marginBottom: 2, width: "100%" }}
                  />
                </LocalizationProvider>

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
                      setGateDescription(newValue.description);
                    } else {
                      setGateId(null);
                      setGateDescription(null);
                    }
                  }}
                />
              </Grid>

              <Grid item sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Horario Finaliza"
                    value={timeDeparture}
                    onChange={(newValue) => setTimeDeparture(newValue)}
                    minDateTime={minDateTime}
                    maxDateTime={maxDateTime}
                    format="YYYY-MM-DD HH:mm"
                    sx={{ "& .MuiOutlinedInput-input": { padding: "10px" }, marginBottom: 2, width: "100%" }}
                  />
                </LocalizationProvider>

                { !checkServiceType && <Autocomplete
                  id="simple-service-type"
                  options={serviceTypeList}
                  getOptionLabel={(option) => option.description ?? "" }
                  renderInput={(params) => (
                    <TextField {...params} label="Servicio" placeholder="Seleccionado(s)" size="small" />
                  )}
                  sx={{ width: "100%", marginBottom: 2 }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={serviceTypeStageId !== null ? serviceTypeList.find(option => option.id === serviceTypeStageId) : null}
                  onChange={(event, newValue) => {
                    if(newValue){
                      setServiceTypeStageId(newValue.id);
                      setServiceTypeStage(newValue.description);
                    } else {
                      setServiceTypeStageId(null);
                      setServiceTypeStage(null);
                    }
                  }}
                />
                }
              </Grid>
            </Grid>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                startIcon={<Check />}
                onClick={handleValidation}
                disabled={(rowDataSeq.length > 0 && enableEdit) ? false: true}
              >
                {ACTIONS.SAVE}
              </Button>

              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => handleAddData({
                    leaderId,
                    leaderDescription,
                    timeArrival,
                    timeDeparture,
                    gateId,
                    gateDescription,
                    serviceTypeStageId,
                    serviceTypeStage
                  })
                }
              >
                AGREGAR
              </Button>
            </div>
          </>
          )}
        </Box>
      </Box>

      { showBackdrop && (
        <Backdrop
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(26, 48, 114, 0.9)",
            color: "white",
            zIndex: 1,
          }}
          open={true}
        >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CircularProgress color="inherit" />
            <p>Guardando Secuencias...</p>
            </Box>
        </Backdrop>
      )}
    </Drawer>
  );
}

export default PlannerSequences;
