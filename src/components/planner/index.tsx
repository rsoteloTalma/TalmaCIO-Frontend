import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { Avatar, CardHeader, Divider, Grid, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material";
import { AirplaneTicket, FilterAlt, Refresh, SaveAlt, Settings } from "@mui/icons-material";

import { DataSheetGrid, textColumn, intColumn, keyColumn, Column, createTextColumn, CellProps, checkboxColumn } from "react-datasheet-grid";
import "react-datasheet-grid/dist/style.css";
import { CellWithId, Operation } from "react-datasheet-grid/dist/types";

import Select from "react-select"
import moment from "moment-timezone";

import { getUser } from "../../shared/auth-service";
import { DataRow } from "./interface";
import { filterAll, filterData } from "../itinerary-list/interface";
import { getDataPlanner, getItineraryFilters, getLeaders, getConveyor, getGate, getAircraf, updDataPlanner, orderDataPlanner } from "./logic";
import { containerSheetGrid, dataSheetGrid } from "./styles";
import "./styles.css";

import PlannerFilters from "./filters";

import BackDrop from "../../shared/fragments/backdrop";
import MessageSnackbar from "../../shared/fragments/message-snackbar";
import PlannerSequences from "./sequences";
import PlannerSettings from "./settings";
import { SERVICE_URLS } from "../../shared/constants";

// import AcceptDialog from "../accept-modal";

const user = getUser();

const Planner: React.FC = () => {
  const [myBase] = useState((user && user.operationAirportId == 27) ? 3 : user.operationAirportId);

  const [loading, setLoading] = useState<boolean>(true);
  const [load, setLoad] = useState<boolean>(false);
  const [fire, setFire] = useState<boolean>(false);

  // data
  const [rowData, setRowData] = useState<DataRow[]>([]);
  const [originData, setOriginData] = useState<DataRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [sequenceData, setSequenceData] = useState<Record<string, any>>({});

  const [openFilters, setOpenFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<filterAll>();

  const [openSequences, setOpenSequences] = useState<boolean>(false);

  // alerts
  const [openMessage, setOpenMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  // config grid
  const [dataLoad, setDataLoad] = useState<boolean>(false);
  const [gateList, setGateList] = useState<any[]>([{value: 1000, label: "S/A"}]);
  const [conveyorList, setConveyorList] = useState<any[]>([]);
  const [leadersList, setLeadersList] = useState<any[]>([]);
  const [aircraftList, setAircraftList] = useState<any[]>([]);

  const [unitMeasureList, setunitMeasureList] = useState<any[]>([
    [
      {value: null, label: "-"},
      {value: "KG", label: "KG"},
      {value: "PMC", label: "PMC"}
    ],
    [
      {value: null, label: "-"},
      {value: "PC", label: "PC"},
      {value: "AKE", label: "AKE"}
    ],
  ]);


  // socket
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [socketMessage, setSocketMessage] = useState<string[]>([]);


  // Ref
  const filteredDataRef = useRef<DataRow[]>([]);

  // Settings
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  // const [selection, setSelection] = useState<boolean>(false);
  // const [dataConfig, setDataConfig] = useState<any>({prepare: prepare, autoHeight: autoHeight, selection: selection});


  // grid
  const [widthGrid, setWidthGrid] = useState<number>(1000);
  const [heightGrid, setHeightGrid] = useState<number>(600);
  
  const updatedRowIds = useMemo(() => new Set(), []);
  const successRowIds = useMemo(() => new Set(), []);
  const dangerRowIds = useMemo(() => new Set(), []);

  const startOfDay = moment().tz("America/Bogota").startOf("day").format();
  const endOfDay = moment().tz("America/Bogota").endOf("day").format();


  // Filter Default
  const [params, setparams] = useState<Record<string, any>>({
    startDate: startOfDay,
    endDate: endOfDay,
    baseId: String(myBase)
  });


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
            startDate: startOfDay,
            endDate: endOfDay,
            baseId: String(myBase)
          };

          const dataPlanner = await getDataPlanner(dataParams);
          const itinerary = await orderDataPlanner(dataPlanner);

          setRowData(itinerary);
          setOriginData(dataPlanner);
          setFilteredData(itinerary);

          // data select list
          const gate = await getGate(myBase);
          const conveyor = await getConveyor(myBase);
          const leaders = await getLeaders(myBase);

          setGateList(gate);
          setConveyorList(conveyor);
          setLeadersList(leaders);

          // data aircraft
          if(itinerary.length > 0){
            const group = itinerary.map(item => item.companyId);
            const precompany = Array.from(new Set(group));
            
            const company = await getAircraf(precompany);
            setAircraftList(company);
          } else {
            setAircraftList([]);
          }

          // params screen
          const screenWidth = window.innerWidth;
          const minusW = (screenWidth < 1300) ? 35 : 55;
          setWidthGrid(screenWidth - minusW);

          const screenHeight = window.innerHeight;
          const minusH = (screenHeight < 800) ? 600 : (screenHeight - 200);
          setHeightGrid(minusH);

          // autoHeight
          if(dataPlanner.length < 15){
            const elements = document.querySelectorAll<HTMLDivElement>('.dsg-container');
            if(elements != undefined){
              elements.forEach((element) => {
                element.style.cssText = '';
              });
            }
          }

          setDataLoad(true);
          setLoading(false);

        } catch (error) {
          setLoading(false);
          setRowData([]);
          setFilteredData([]);
          setAircraftList([]);
        }
      }
    }
    fetchData();
  }, [loading]);


  // filter
  useEffect(() => {
    async function fetchDataLoad() {
      if (load) {
        try {
          const dataPlanner = await getDataPlanner(params);
          const itinerary = await orderDataPlanner(dataPlanner);

          // data aircraft
          if(itinerary.length > 0){
            const group = itinerary.map(item => item.companyId);
            const precompany = Array.from(new Set(group));

            const company = await getAircraf(precompany);
            setAircraftList(company);
          } else {
            setAircraftList([]);
          }

          setRowData(itinerary);
          setOriginData(dataPlanner);
          setFilteredData(itinerary);
          setLoad(false);

        } catch (error) {
          setLoad(false);
          setRowData([]);
          setAircraftList([]);
        }
      }
    }
    fetchDataLoad();
  }, [load]);


  // socket

  // useEffect(() => {
  //   async function fetchUpdateData(myParams: Record<string, any>) {
  //     try {
  //       const newPlanner = await getDataPlanner(myParams);
  //       const itinerary = await orderDataPlanner(newPlanner);

  //       setRowData(itinerary);
  //       setOriginData(newPlanner);
  //       setFilteredData(itinerary);

  //     } catch (error) {
  //       console.log("error :>> ", error);
  //       setRowData([]);
  //       return [];
  //     }
  //   }

  //   try {
  //     const urlString: string | undefined = SERVICE_URLS.ROOT;
  //     let wsUrl = "";

  //     if(urlString){
  //       const url = new URL(urlString);
  //       wsUrl = `wss://${url.hostname}:${url.port}`;
  //     }

  //     const ws = new WebSocket(wsUrl);
  
  //     ws.onopen = () => {
  //       console.log("Connected to WebSocket server");
  //     };
  
  //     ws.onmessage = async (event: MessageEvent) => {
  //       const message = event.data;
  //       setSocketMessage(prevMessages => [...prevMessages, message]);

  //       await fetchUpdateData(params);
  //     };
  
  //     ws.onclose = () => {
  //       console.log("Disconnected from WebSocket server");
  //     };
  
  //     setSocket(ws);
  //     return () => { ws.close(); };

  //   } catch (e) {
  //     console.error("Invalid URL WS:", e);
  //   }
  // }, [fire]);


  useEffect(() => {
    async function fetchUpdateData(myParams: Record<string, any>) {
      try {
        const newPlanner = await getDataPlanner(myParams);
        const itinerary = await orderDataPlanner(newPlanner);

        setRowData(itinerary);
        setOriginData(newPlanner);
        setFilteredData(itinerary);

      } catch (error) {
        console.log("error :>> ", error);
        setRowData([]);
        return [];
      }
    }

    try {
      const urlString: string | undefined = SERVICE_URLS.ROOT;
      let wsUrl = "";

      if(urlString){
        const url = new URL(urlString);
        if(url.port != ""){
          wsUrl = `wss://${url.hostname}:${url.port}`;
        } else {
          wsUrl = `wss://${url.hostname}`;
        }
      }
      const ws = new WebSocket(wsUrl);
  
      ws.onopen = () => {
        console.log("Connected to WebSocket server");
      };
  
      ws.onmessage = async (event: MessageEvent) => {
        const message = event.data;
        setSocketMessage(prevMessages => [...prevMessages, message]);

        await fetchUpdateData(params);
      };
  
      ws.onclose = () => {
        console.log("Disconnected from WebSocket server");
      };
  
      setSocket(ws);
      return () => { ws.close(); };

    } catch (e) {
      console.error("Invalid URL WS:", e);
    }
  }, []);


  //- Filter
  const handleDrawer = () => {
    setOpenFilters(!openFilters);
  }

  //- Load
  const handleLoad = (filterData: Record<string, any>) => {        
    filterData.startDate = moment(String(filterData.startDate)).tz("America/Bogota").startOf("day").format("YYYY-MM-DD HH:mm");
    filterData.endDate = moment(String(filterData.endDate)).tz("America/Bogota").endOf("day").format("YYYY-MM-DD HH:mm");

    setparams(filterData);
    setLoad(true);
    setOpenFilters(false);
  };

  const handleReload = () => {
    setLoading(true);
  }


  //- Search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filter = rowData.filter(
      (row) =>
        (String(row.serviceHeaderId).toLowerCase() ?? "").includes(query) ||
        (row.destiny?.toLowerCase() ?? "").includes(query) ||
        (row.origin?.toLowerCase() ?? "").includes(query) ||
        (row.company?.toLowerCase() ?? "").includes(query) ||
        (row.serviceTypeStage?.toLowerCase() ?? "").includes(query) ||
        (row.outgoingFlight?.toLowerCase() ?? "").includes(query) ||
        (row.incomingFlight?.toLowerCase() ?? "").includes(query) ||
        (row.ghLeader?.toLowerCase() ?? "").includes(query) ||
        (row.sPaxLeader?.toLowerCase() ?? "").includes(query) ||
        (row.aopLeader?.toLowerCase() ?? "").includes(query)
    );

    setFilteredData(filter);
  };


  // Select Components
  const GateList = ({ setRowData, stopEditing, rowData, focus }: CellProps) => {
    const ref = useRef(null);

    useLayoutEffect(() => {
      if (focus && ref.current) {
        (ref.current as any).focus();
      } else if (ref.current) {
        (ref.current as any).blur();
      }
    }, [focus]);

    return (
      <Select
        ref={ref}
        styles={{
          container: (provided) => ({
            ...provided,
            width: "100%",
          }),
          // control: (provided) => ({
          //   ...provided,
          //   width: "100%",
          // }),
          indicatorsContainer: (provided) => ({
            ...provided,
            opacity: rowData ? 1 : 0,
          }),
          placeholder: (provided) => ({
            ...provided,
            opacity: rowData ? 1 : 0,
          }),
        }}
        value={ gateList.find(({ value }) => value === rowData.gateId) ?? null }
        options={gateList}
        menuIsOpen={focus}
        menuPortalTarget={document.body}
        onChange={(data) => {
          rowData.gate = data?.label;
          rowData.gateId = data?.value;
          setRowData(rowData);
          setTimeout(stopEditing, 0);
        }}
        onMenuClose={() => stopEditing({ nextRow: false })}
      />
    )
  }

  const ConveyorList = ({ setRowData, stopEditing, rowData, focus }: CellProps) => {
    const ref = useRef(null);

    useLayoutEffect(() => {
      if (focus && ref.current) {
        (ref.current as any).focus();
      } else if (ref.current) {
        (ref.current as any).blur();
      }
    }, [focus]);

    return (
      <Select
        ref={ref}
        styles={{
          container: (provided) => ({
            ...provided,
            width: "100%",
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            opacity: rowData ? 1 : 0,
          }),
          placeholder: (provided) => ({
            ...provided,
            opacity: rowData ? 1 : 0,
          }),
        }}
        value={ conveyorList.find(({ value }) => value === rowData.conveyorId) ?? null }
        options={conveyorList}
        menuIsOpen={focus}
        menuPortalTarget={document.body}
        onChange={(data) => {
          rowData.conveyor = data?.label;
          rowData.conveyorId = data?.value;
          setRowData(rowData);
          setTimeout(stopEditing, 0);
        }}
        onMenuClose={() => stopEditing({ nextRow: false })}
      />
    )
  }

  const UnitMeasureList = (field: string, type: number, { setRowData, stopEditing, rowData, focus }: CellProps) => {
    const ref = useRef(null);
    useLayoutEffect(() => {
      if (focus && ref.current) {
        (ref.current as any).focus();
      } else if (ref.current) {
        (ref.current as any).blur();
      }
    }, [focus]);

    return (
      <Select
        ref={ref}
        styles={{
          container: (provided) => ({
            ...provided,
            width: "100%",
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            opacity: rowData ? 1 : 0,
          }),
          placeholder: (provided) => ({
            ...provided,
            opacity: rowData ? 1 : 0,
          }),
        }}
        value={ unitMeasureList[type].find(({ value }: any) => value === rowData[field]) ?? null }
        options={unitMeasureList[type]}
        menuIsOpen={focus}
        menuPortalTarget={document.body}
        onChange={(data) => {
          rowData[field] = data?.value;
          setRowData(rowData);
          setTimeout(stopEditing, 0);
        }}
        onMenuClose={() => stopEditing({ nextRow: false })}
      />
    )
  }

  const AirportsList = (field: string, code: string, { setRowData, stopEditing, rowData, focus }: CellProps) => {
    const ref = useRef(null);

    const preairports = (Array.isArray(filters?.airports)) ? filters?.airports : [];
    const airportsList = preairports.map((item: any) => ({
      value: item.id,
      label: item.description,
    }));

    useLayoutEffect(() => {
      if (focus && ref.current) {
        (ref.current as any).focus();
      } else if (ref.current) {
        (ref.current as any).blur();
      }
    }, [focus]);

    return (
      <Select
        ref={ref}
        styles={{
          container: (provided) => ({
            ...provided,
            width: "100%",
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            opacity: rowData ? 1 : 0,
          }),
          placeholder: (provided) => ({
            ...provided,
            opacity: rowData ? 1 : 0,
          }),
        }}
        value={ airportsList.find(({ value }: any) => value === rowData[field]) ?? null }
        options={airportsList}
        menuIsOpen={focus}
        menuPortalTarget={document.body}
        onChange={(data) => {
          rowData[field] = data?.value;
          rowData[code] = data?.label.slice(0, 3);
          setRowData(rowData);
          setTimeout(stopEditing, 0);
        }}
        onMenuClose={() => stopEditing({ nextRow: false })}
        components={{ DropdownIndicator: () => null }}
      />
    )
  }

  const AircraftList = ({ setRowData, stopEditing, rowData, focus }: CellProps) => {
    const ref = useRef(null);
    const id = rowData.companyId;

    useLayoutEffect(() => {
      if (focus && ref.current) {
        (ref.current as any).focus();
      } else if (ref.current) {
        (ref.current as any).blur();
      }
    }, [focus]);

    return (
      <Select
        ref={ref}
        styles={{
          container: (provided) => ({
            ...provided,
            width: "100%",
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            opacity: rowData ? 1 : 0,
          }),
          placeholder: (provided) => ({
            ...provided,
            opacity: rowData ? 1 : 0,
          }),
        }}
        value={ aircraftList[id].find(({ value }: any) => value === rowData.aircraftId) ?? null }
        options={aircraftList[id]}
        menuIsOpen={focus}
        menuPortalTarget={document.body}
        onChange={(data) => {
          rowData.aircraftId = data?.value;
          setRowData(rowData);
          setTimeout(stopEditing, 0);
        }}
        onMenuClose={() => stopEditing({ nextRow: false })}
        components={{ DropdownIndicator: () => null }}
      />
    )
  }

  const LeadersList = (field: string, text: string, code: string, { setRowData, stopEditing, rowData, focus }: CellProps) => {
    const ref = useRef(null);

    const filtered = leadersList.filter((item: any) => item.extra === code);
    const finalLeadersList = filtered.map((item: any) => ({
      value: item.id,
      label: item.description,
    }));

    useLayoutEffect(() => {
      if (focus && ref.current) {
        (ref.current as any).focus();
      } else if (ref.current) {
        (ref.current as any).blur();
      }
    }, [focus]);

    return (
      <Select
        ref={ref}
        styles={{
          container: (provided) => ({
            ...provided,
            width: "100%",
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            opacity: rowData ? 1 : 0,
          }),
          placeholder: (provided) => ({
            ...provided,
            opacity: rowData ? 1 : 0,
          }),
        }}
        value={ finalLeadersList.find(({ value }: any) => value === rowData[field]) ?? null }
        options={finalLeadersList}
        menuIsOpen={focus}
        menuPortalTarget={document.body}
        onChange={(data) => {
          rowData[text] = data?.label;
          rowData[field] = data?.value;

          setRowData(rowData);
          setTimeout(stopEditing, 0);
        }}
        onMenuClose={() => stopEditing({ nextRow: false })}
        components={{ DropdownIndicator: () => null }}
      />
    )
  }



  // params data grid
  const getCellClassName = (rowData: { serviceHeaderId: number }) => {
    // console.log("rowData :>> ", rowData);
    return "cell-neutro";
    //return rowData.serviceHeaderId % 2 === 0 ? "cell-green" : "cell-red";
  };


  //- Edit Cell
  const handleActiveCellChange = async (opts: { cell: CellWithId | null }) => {
    const { cell } = opts;

    if(cell){
      if(filteredDataRef.current.length > 0){
        const datos = filteredDataRef.current[cell.row];
        let field = cell.colId;
        let value = String(datos[field as keyof typeof datos]);

        // sta
        if(cell.colId == "sta" || cell.colId == "staTime"){
          field = "sta";
          value = `${datos.sta} ${datos.staTime}:00`;

          const search = originData.find((item: any) => item.serviceHeaderId === datos.serviceHeaderId);
          const index = originData.findIndex((item: any) => item.serviceHeaderId === datos.serviceHeaderId)

          if(search !== undefined){
            const editDate = `${datos.sta}T${datos.staTime}:00`;

            originData[index] = { ...originData[index], sta: editDate };
            setOriginData(originData);
          }
        }

        // std
        if(cell.colId == "std" || cell.colId == "stdTime"){
          field = "std";
          value = `${datos.std} ${datos.stdTime}:00`;

          const search = originData.find((item: any) => item.serviceHeaderId === datos.serviceHeaderId);
          const index = originData.findIndex((item: any) => item.serviceHeaderId === datos.serviceHeaderId)
          
          if(search !== undefined){
            const editDate = `${datos.std}T${datos.stdTime}:00`;

            originData[index] = { ...originData[index], std: editDate };
            setOriginData(originData);
          }
        }

        // ata
        if(cell.colId == "ata" || cell.colId == "ataTime"){
          field = "ata";
          value = `${datos.ata} ${datos.ataTime}:00`;

          const search = originData.find((item: any) => item.serviceHeaderId === datos.serviceHeaderId);
          const index = originData.findIndex((item: any) => item.serviceHeaderId === datos.serviceHeaderId)

          if(search !== undefined){
            const editDate = `${datos.ata}T${datos.ataTime}:00`;

            originData[index] = { ...originData[index], ata: editDate };
            setOriginData(originData);
          }
        }

        // atd
        if(cell.colId == "atd" || cell.colId == "atdTime"){
          field = "atd";
          value = `${datos.atd} ${datos.atdTime}:00`;

          const search = originData.find((item: any) => item.serviceHeaderId === datos.serviceHeaderId);
          const index = originData.findIndex((item: any) => item.serviceHeaderId === datos.serviceHeaderId)

          if(search !== undefined){
            const editDate = `${datos.atd}T${datos.atdTime}:00`;

            originData[index] = { ...originData[index], atd: editDate };
            setOriginData(originData);
          }
        }

        handleEdit({
          serviceHeaderId: datos.serviceHeaderId,
          slotSequence: datos.slotSequence,
          field: field,
          value: value,
          employeeId: user.employeeId
        });
      }
    }
  };


  const handleChange = (newValue: DataRow[], operations: Operation[]) => {
    for (const operation of operations) {
      if (operation.type === "UPDATE") {
        newValue
          .slice(operation.fromRowIndex, operation.toRowIndex)
          .forEach(({ serviceHeaderId }) => {
            updatedRowIds.add(serviceHeaderId);
          });
      }
      // Handle delete
    }
    filteredDataRef.current = newValue;
    setFilteredData(newValue);
  }


  const handleEdit = async (data: Record<string, any>) => {
    const updated = await updDataPlanner(data);
    setMessage(updated.messages);
    setFire(!fire);

    if(updated.status > 0){
      updatedRowIds.clear();
      successRowIds.add(data.serviceHeaderId);
    } else {
      if(data.field != "ghLeader") {
        cancel();
      }
      dangerRowIds.add(data.serviceHeaderId);
      setOpenMessage(true);
    }

    setTimeout(() => {
      successRowIds.clear();
      dangerRowIds.clear();
    }, 500);
  };


  const cancel = () => {
    setFilteredData(rowData);
    updatedRowIds.clear();
  }


  const handleActiveComponent = async (opts: { cell: CellWithId | null }) => {
    const { cell } = opts;
    if (cell) {
      const { colId } = cell;
      if (colId === "ghLeader") {
        if(filteredData[cell.row].serviceHeaderId > 0){
          setSequenceData({serviceHeaderId: filteredData[cell.row].serviceHeaderId});
          setOpenSequences(true);
        }
      }
    }
  };

  const LoadLeaders = ({ rowData }: CellProps) => {
    const newText = rowData.ghLeader.replace(/\s*\(.*\)$/, "");
    return (
      <span style={{fontSize: 14}}>{newText.slice(0, 30).trim()}</span>
    );
  };

  const handleSequences = async (data: Record<string, any>) => {
    if(data.success){
      setFire(!fire);
    }
  };


  // Settings
  const handleSettings = () => {
    setOpenSettings(true);
    console.log("entra open");
  };

  const handleDefineGrid = (data: any[]) => {
    console.log("data-define :>> ", data);
    return false;
  };


  //- Columns
  const columns: Column<DataRow>[] = [
    {
      ...keyColumn<DataRow, "serviceHeaderId">("serviceHeaderId", textColumn),
      title: "CIO Code",
      disabled: true,
    },
    {
      ...keyColumn<DataRow, "slotSequence">("slotSequence", intColumn),
      title: "SEQ",
      minWidth: 50,
      disabled: true
    },
    {
      ...keyColumn<DataRow, "base">("base", textColumn),
      title: "Base",
      disabled: true,
    },
    // {
    //   ...keyColumn<DataRow, "companyLogo">("companyLogo", textColumn),
    //   title: "Airline",
    //   component: ({ rowData }) => <img src={rowData.companyLogo ?? ""} alt="airline-logo" />,
    //   disabled: true,
    // },
    {
      ...keyColumn<DataRow, "company">("company", textColumn),
      title: "Cliente",
      disabled: true,
    },
    {
      ...keyColumn<DataRow, "serviceTypeStage">("serviceTypeStage", textColumn),
      title: "Servicio",
      minWidth: 150,
      disabled: true
    },
    {
      ...keyColumn<DataRow, "aircraftId">("aircraftId", createTextColumn({
        alignRight: true,
      })),
      title: "Matrícula",
      component: (datacell) => AircraftList(datacell),
      disableKeys: true,
      keepFocus: true,
      minWidth: 130
    },
    {
      ...keyColumn<DataRow, "incomingCargoValue">("incomingCargoValue", textColumn),
      title: "Cant. Carga",
    },
    {
      ...keyColumn<DataRow, "incomingCargoUnit">("incomingCargoUnit", createTextColumn({
        alignRight: true,
      })),
      title: "Unidad Medida",
      component: (datacell) => UnitMeasureList("incomingCargoUnit", 0, datacell),
      disableKeys: true,
      keepFocus: true
    },
    {
      ...keyColumn<DataRow, "incomingBaggageValue">("incomingBaggageValue", textColumn),
      title: "Cant. Equipaje",
    },
    {
      ...keyColumn<DataRow, "incomingBaggageUnit">("incomingBaggageUnit", createTextColumn({
        alignRight: true,
      })),
      title: "Unidad Medida",
      component: (datacell) => UnitMeasureList("incomingBaggageUnit", 1, datacell),
      disableKeys: true,
      keepFocus: true
    },
    {
      ...keyColumn<DataRow, "conveyorId">("conveyorId", createTextColumn({
        alignRight: true,
      })),
      title: "Banda",
      component: ConveyorList,
      disableKeys: true,
      keepFocus: true
    },
    {
      ...keyColumn<DataRow, "incomingFlight">("incomingFlight", textColumn),
      title: "Vuelo Llegando",
    },
    {
      ...keyColumn<DataRow, "originId">("originId", createTextColumn({
        alignRight: true,
      })),
      title: "Origen",
      component: (datacell) => AirportsList("originId", "origin", datacell),
      disableKeys: true,
      keepFocus: true,
      minWidth: 200
    },
    {
      ...keyColumn<DataRow, "sta">("sta", textColumn),
      title: "STA",
      minWidth: 110
    },
    {
      ...keyColumn<DataRow, "staTime">("staTime", textColumn),
      title: "Time"
    },
    {
      ...keyColumn<DataRow, "ataTime">("ataTime", textColumn),
      title: "ATA Time"
    },
    {
      ...keyColumn<DataRow, "gate">("gate", textColumn),
      title: "Parking Llegada",
      disabled: true,
    },
    {
      ...keyColumn<DataRow, "ghLeader">("ghLeader", createTextColumn({
        alignRight: true,
      })),
      title: "Leader",
      component: (datacell) => LoadLeaders(datacell),
      minWidth: 250,
      disableKeys: true,
      keepFocus: true
    },
    {
      ...keyColumn<DataRow, "sPaxLeaderId">("sPaxLeaderId", createTextColumn({
        alignRight: true,
      })),
      title: "PAX-Leader",
      component: (datacell) => LeadersList("sPaxLeaderId", "sPaxLeader", "97", datacell),
      disableKeys: true,
      keepFocus: true,
      minWidth: 200
    },
    {
      ...keyColumn<DataRow, "aopLeaderId">("aopLeaderId", createTextColumn({
        alignRight: true,
      })),
      title: "AOP-Leader",
      component: (datacell) => LeadersList("aopLeaderId", "aopLeader", "98", datacell),
      disableKeys: true,
      keepFocus: true,
      minWidth: 200
    },
    {
      ...keyColumn<DataRow, "gateDep">("gateDep", textColumn),
      title: "Parking Salida",
      disabled: true,
    },
    {
      ...keyColumn<DataRow, "atdTime">("atdTime", textColumn),
      title: "ATD Time"
    },
    {
      ...keyColumn<DataRow, "stdTime">("stdTime", textColumn),
      title: "Time"
    },
    {
      ...keyColumn<DataRow, "std">("std", textColumn),
      title: "STD",
      minWidth: 110
    },
    {
      ...keyColumn<DataRow, "outgoingFlight">("outgoingFlight", textColumn),
      title: "Vuelo Saliendo",
    },
    {
      ...keyColumn<DataRow, "destinyId">("destinyId", createTextColumn({
        alignRight: true,
      })),
      title: "Destino",
      component: (datacell) => AirportsList("destinyId", "destiny", datacell),
      disableKeys: true,
      keepFocus: true,
      minWidth: 200
    },
    {
      ...keyColumn<DataRow, "outgoingCargoValue">("outgoingCargoValue", textColumn),
      title: "Cant. Carga",
    },
    {
      ...keyColumn<DataRow, "outgoingCargoUnit">("outgoingCargoUnit", createTextColumn({
        alignRight: true,
      })),
      title: "Unidad Medida",
      component: (datacell) => UnitMeasureList("outgoingCargoUnit", 0, datacell),
      disableKeys: true,
      keepFocus: true
    },
    {
      ...keyColumn<DataRow, "outgoingBaggageValue">("outgoingBaggageValue", textColumn),
      title: "Cant. Equipaje",
    },
    {
      ...keyColumn<DataRow, "outgoingBaggageUnit">("outgoingBaggageUnit", createTextColumn({
        alignRight: true,
      })),
      title: "Unidad Medida",
      component: (datacell) => UnitMeasureList("outgoingBaggageUnit", 1, datacell),
      disableKeys: true,
      keepFocus: true
    },
    {
      ...keyColumn<DataRow, "comments">("comments", textColumn),
      title: "Observaciones",
      minWidth: 200
    },
    {
      ...keyColumn<DataRow, "apu">("apu", checkboxColumn),
      title: "APU Inop"
    }
  ];


  if(openMessage){
    setTimeout(() => { setOpenMessage(false); }, 5500);
  }

  if (loading) return (<BackDrop />);
  if (load) return (<BackDrop />);

  return (
    <>
      <PlannerFilters
        open={openFilters}
        handleClose={setOpenFilters}
        handleFilter={handleLoad}
        airports={(Array.isArray(filters?.airports)) ? filters?.airports.find((airport: filterData) => airport.id === myBase) : []}
      />

      { openSequences && <PlannerSequences
        open={openSequences}
        data={sequenceData}
        gate={gateList}
        leadersList={leadersList}
        handleClose={setOpenSequences}
        handleSequences={handleSequences}
      /> }

      { openSettings && <PlannerSettings
        open={openSettings}
        data={[{id:1}]}
        handleClose={setOpenSettings}
        handleDefineGrid={handleDefineGrid}
      /> }

      { openMessage && <MessageSnackbar message={message} /> }

      <Grid container sx={{ background: "#FAFAFA" }} paddingX={2}>
        <Grid item xs={7} md={8} >
          <CardHeader 
            avatar={
              <Avatar sx={{ bgcolor: "#D6F4FF" }} aria-label="recipe" variant="rounded">
                <AirplaneTicket sx={{ color: "#00B0EF" }} />
              </Avatar>
            }
            title={
              <Typography sx={{ color: "#1A3072" }} variant="button" display="block">
                Planeador
              </Typography>
            }
            subheader="Servicios Activos"
            sx={{ paddingLeft: 0 }}
          />
        </Grid>

        <Grid item xs={5} md={4} mt={2} justifyItems={"end"}>
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
              value={searchQuery}
              onChange={handleSearch}
              //onChange={onFilterTextChange}
              size="small"
              variant="outlined"
              placeholder="Filtro rápido..."
            />

            <Divider sx={{ height: 28, marginX: 1 }} orientation="vertical" />

            <Tooltip title="Descargar">
              <IconButton sx={{ p: "10px" }} aria-label="download" color="success">
                <SaveAlt />
              </IconButton>
            </Tooltip>

            <Tooltip title="Config">
              <IconButton sx={{ p: "10px" }} aria-label="settings" onClick={handleSettings}>
                <Settings />
              </IconButton>
            </Tooltip>
          </Paper>
        </Grid>

        <Grid item xs={12} mb={2}>
          <Divider sx={{ marginBottom: 2 }}/>

          { dataLoad && <div style={containerSheetGrid(heightGrid)}>
            <DataSheetGrid
              style={dataSheetGrid(widthGrid)}
              value={filteredData}
              columns={columns}
              onBlur={handleActiveCellChange}
              onChange={handleChange}
              rowClassName={({ rowData }) => {
                if (updatedRowIds.has(rowData.serviceHeaderId)) return "row-updated";
                if (successRowIds.has(rowData.serviceHeaderId)) return "row-success";
                if (dangerRowIds.has(rowData.serviceHeaderId)) return "row-danger";
              }}
              height={heightGrid}
              addRowsComponent={false}
              disableExpandSelection
              onFocus={handleActiveComponent}
            />
          </div> }

        </Grid>
      </Grid>
    </>
  );
}

export default Planner;