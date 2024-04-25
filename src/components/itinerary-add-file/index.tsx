import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { Alert, Avatar, Button, CardHeader, Divider, Grid, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Paper, Tooltip, Typography } from "@mui/material";
import { Check, Close, Info, LocalAirport, Upload } from "@mui/icons-material";
import { ACTIONS } from "../../shared/constants";

import { processRecords, sendDataFile, validationFields, formatAlerts } from "./logic";
import BackDrop from "../../shared/fragments/backdrop";


const ItineraryAddFile: React.FC = () => {

  const [data, setData] = useState<any[]>([]);
  const [myFile, setMyFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>("");
  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTable, setActiveTable] = useState<boolean>(false);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalAlerts, setTotalAlerts] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);

  const [colorTotal, setColorTotal] = useState<string>("");
  const [colorAlert, setColorAlert] = useState<string>("");
  const [colorError, setColorError] = useState<string>("");

  const [responseMessage, setResponseMessage] = useState<string>("");

  const [rowData, setRowData] = useState<any[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const removeSpacesFromKeys = (obj: any) => {
    const newObj: any = {};
    Object.keys(obj).forEach(key => {
      newObj[
        key.replace(/\s+/g, "")
          .replace(/[áä]/gi, 'a')
          .replace(/[éë]/gi, 'e')
          .replace(/[íï]/gi, 'i')
          .replace(/[óö]/gi, 'o')
          .replace(/[úü]/gi, 'u')
      ] = obj[key];
    });
    return newObj;
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file?.name ?? "";

    setMyFile(file);
    setFileName(fileName);

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (!e.target) return;

      const data = e.target.result as ArrayBuffer;
      const workbook = XLSX.read(new Uint8Array(data));

      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const jsonDataWithoutSpaces = jsonData.map(removeSpacesFromKeys);

      setData(jsonDataWithoutSpaces);
      setTotalCount(jsonData.length)

      handleFieldValidator(jsonDataWithoutSpaces);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFieldValidator = async (fields: any[]) => {
    const valField = await validationFields(fields);

    let alerts: any[] = [];
    let errors: any[] = [];

    if(valField.success){
      setTotalErrors(valField.errors.length);
      setColorError("red");
      setActiveTable(true);
      errors = await formatAlerts(valField.errors, 0);
    } else {
      setColorTotal("green");
    }

    if(valField.alerts.length > 0){
      setTotalAlerts(valField.alerts.length);
      setColorAlert("orange");
      setActiveTable(true);
      alerts = await formatAlerts(valField.alerts, 3);
    }

    setRowData([...errors, ...alerts]);
    setDisabled(valField.success);
  };

  const handleFileReset = () => {
    setMyFile(null);
    setFileName("");
    setDisabled(true);
    setRowData([]);
    setActiveTable(false);

    if(inputRef.current) {
      inputRef.current.value = "";
    }

    setResponseMessage("");
    setColorTotal("");
    setColorAlert("");
    setColorError("");
    setTotalCount(0);
    setTotalAlerts(0);
    setTotalErrors(0);
  };

  const handleSend = async () => {
    let errors: any[] = [];
    if(myFile !== null){
      setLoading(true);
      handleFileReset();

      const process = await processRecords(data, myFile);
      const send = await sendDataFile(process);

      if(send.errors.length > 0){
        errors = await formatAlerts(send.errors, 0);

        setColorError("red");
        setTotalErrors(send.errors.length);

        setRowData(errors);
        setActiveTable(true);
      }

      setResponseMessage(send.data);
      setLoading(false);
    }
  };

  const columnData: any = [
    { headerName: "Fila", field: "id", width: 90 },
    { headerName: "Descripción", field: "description", width: 400 },
    { headerName: "Tipo", field: "type", width: 100 },
  ];

  if (loading) return (<BackDrop />);

  return (
    <>
      <Grid container sx={{ background: "#FAFAFA" }} paddingX={2} justifyContent="center" >
        <Grid item xs={12}>
          <CardHeader 
            avatar={
              <Avatar sx={{ bgcolor: "#D6F4FF" }} aria-label="recipe" variant="rounded">
                <LocalAirport sx={{ color: "#00B0EF" }} fontSize="small" />
              </Avatar>
            }
            title = {
              <Typography sx={{ color: "#1A3072" }} variant="button" display="block">
                Itinerario
              </Typography>
            }
            subheader="Cargue masivo de itinerario"
            sx={{paddingLeft: 0}}
            action={
              <IconButton aria-label="info">
                <Info />
              </IconButton>
            }
          />
        </Grid>

        <Grid item m={2}>
          <Paper
            component="form"
            sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 450 }}
          >
            <IconButton sx={{ p: "10px", color: colorError }} aria-label="menu" onClick={handleFileReset}>
              <Close />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder={fileName || "Seleccionar Archivo"}
              inputProps={{ "aria-label": "seleccionar archivo" }}
              readOnly
            />

            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

            <input
              accept=".xlsx,.xls"
              type="file"
              id="file"
              ref={inputRef}
              style={{ display: "none" }}
              onChange={handleFile}
            />
            <label htmlFor="file">
              <Tooltip title="Seleccionar Archivo">
                <IconButton color="primary" sx={{ p: "10px" }} aria-label="selected file" component="span">
                  <Upload />
                </IconButton>
              </Tooltip>
            </label>

            <Divider sx={{ height: 28, m: 0.5, marginRight: 1 }} orientation="vertical" />

            <Button variant="contained" component="span" disabled={disabled} onClick={handleSend}>
              {ACTIONS.LOAD}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={8} bgcolor={"#FFFFFF"} mb={5}>
          <List
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%"
            }}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: colorTotal }} >
                  <Info />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="# Registros" secondary={totalCount} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: colorAlert }} >
                  <Info />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Alertas" secondary={totalAlerts} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: colorError }} >
                  <Info />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Errores" secondary={totalErrors} />
            </ListItem>
          </List>

          <Divider sx={{margin: 2}}/>
          { responseMessage != "" && <div style={{ margin: 10 }}>
            <Alert icon={<Check fontSize="inherit" />} severity="success">
              {responseMessage}
            </Alert>
          </div>}

          { activeTable && <div
            className="ag-theme-quartz"
            style={{ height: 500 }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnData}
            />
          </div>
          }
        </Grid>
      </Grid>
    </>
  );
}

export default ItineraryAddFile;
