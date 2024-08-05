import { callAPI } from "../../shared/network";
import { GetAircraftByCompany, GetConveyorByAirport, GetGateByAirport, GetLeadersByAirport } from "../itinerary-list/add/logic";
import { DataRow } from "./interface";


export async function getItineraryFilters() {
  const data = await callAPI(
    null,
    "Itinerary/GetItineraryFilters", "get");

  return data.data || [];
}


export async function getDataPlanner(filters: Record<string, any>): Promise<DataRow[]> {
  const receive = await callAPI(
    filters,
    "Planner/GetPlanner", "post");

  const { data } = receive;

  if(data.success > 1){
    console.log("response -> ", data);
    return [];
  }

  if(data.data.length > 0) return data.data;
  return [];
}


export async function getPlannerByServiceHeader(filters: Record<string, any>) {
  const receive = await callAPI(
    filters,
    "Planner/GetPlanner", "post");

  const { data } = receive;

  if(data.success > 1){
    console.log("response -> ", data);
    return [];
  }

  if(data.data.length > 0) return data.data;
  return [];
}


export async function orderDataPlanner(data: any[]): Promise<DataRow[]> {
  if(data.length > 0){
    const response = await orderData(data);
    return response;
  }
  return [];
}


export async function updDataPlanner(updated: Record<string, any>) {
  // console.log('updated :>> ', updated);
  const receive = await callAPI(
    updated,
    "Planner", "put");

  const { data } = receive;

  if(data.success > 1){
    console.log("response -> ", data);
    return [];
  }

  return data.data;
}


// select component
export async function getGate(id: number) {
  const pregate = await GetGateByAirport(id);
  const gate = pregate.map((item: any) => ({
    value: item.id,
    label: item.description,
  }));
  gate.push({value: 1000, label: "S/A"});

  return gate;
}


export async function getConveyor(id: number) {
  const preconveyor = await GetConveyorByAirport(id);
  const conveyor = preconveyor.map((item: any) => ({
    value: item.id,
    label: item.description,
  }));
  conveyor.push({value: null, label: "-"});

  return conveyor;
}


export async function getAircraf(ids: any[]) {
  const aircraftList: any[] = [];

  for (const id of ids) {
    const info = await GetAircraftByCompany(id);

    if(info.length > 0){
      aircraftList[id] = info.map((item: any) => ({
        value: item.id,
        label: item.description,
      }));

      if (!aircraftList[id].some((item: any) => item.value === null)) {
        aircraftList[id].push({ value: null, label: "Sin Matricula" });
      }
    }
  }

  return aircraftList;
}


export async function getLeaders(id: number) {
  const leaders = await GetLeadersByAirport(id);
  return leaders;
}


// functions
async function orderData(data: any[]) {
  const retorno: any[] = [];

  data.forEach((item, key) => {
    const seq = (item.sequences.length - 1);
    const staDate = item.sta.split('T');
    const stdDate = item.std.split('T');

    const ataDate = (item.ata === null) ? staDate: item.ata.split('T');
    const atdDate = (item.atd === null) ? stdDate: item.atd.split('T');

    const row = {
      serviceHeaderId: item.serviceHeaderId,
      baseId: item.baseId,
      base: item.base,
      destinyId: item.destinyId,
      destiny: item.destiny,
      originId: item.originId,
      origin: item.origin,
      companyId: item.companyId,
      company: item.company,
      companyLogo: `https://content.airhex.com/content/logos/airlines_${item.company}_20_20_s.png`,
      aircraftId: item.aircraftId,
      aircraft: item.aircraft,
      aircraftType: item.aircraftType,
      conveyorId: item.conveyorId,
      conveyor: item.conveyor,
      outgoingFlight: item.outgoingFlight,
      incomingFlight: item.incomingFlight,
      flow: item.flow,
      controlAtOrigin: item.controlAtOrigin,
      crewChange: item.crewChange,
      charter: item.charter,
      incomingCargoValue: item.incomingCargoValue,
      incomingCargoUnit: item.incomingCargoUnit,
      outgoingCargoValue: item.outgoingCargoValue,
      outgoingCargoUnit: item.outgoingCargoUnit,
      incomingBaggageValue: item.incomingBaggageValue,
      incomingBaggageUnit: item.incomingBaggageUnit,
      outgoingBaggageValue: item.outgoingBaggageValue,
      outgoingBaggageUnit: item.outgoingBaggageUnit,
      sta: staDate[0],
      staTime: staDate[1].slice(0, 5),
      std: stdDate[0],
      stdTime: stdDate[1].slice(0, 5),
      eta: item.eta,
      etd: item.etd,
      ata: ataDate[0],
      ataTime: ataDate[1].slice(0, 5),
      atd: atdDate[0],
      atdTime: atdDate[1].slice(0, 5),
      cancelledDepartureFlightNumber: item.cancelledDepartureFlightNumber,
      comments: item.comments,
      cancelledFlight: item.cancelledFlight,
      realEnd: item.realEnd,
      realStart: item.realStart,
      sPaxLeaderId: item.sPaxLeaderId,
      sPaxLeader: item.sPaxLeader,
      aopLeaderId: item.aopLeaderId,
      aopLeader: item.aopLeader,
      apu: item.apu,
    // list
      slotSequence: item.sequences[seq].slotSequence,
      gateId: item.sequences[0].gateId,
      gate: item.sequences[0].gate,
      gateDepId: item.sequences[seq].gateId,
      gateDep: item.sequences[seq].gate,
      serviceTypeStageId: item.sequences[seq].serviceTypeStageId,
      serviceTypeStage: item.sequences[seq].serviceTypeStage,
      ghLeaderId: item.sequences[seq].ghLeaderId,
      ghLeader: item.sequences[seq].ghLeader,
      startDate: item.sequences[seq].startDate,
      endDate: item.sequences[seq].endDate,
      startSlot: item.sequences[seq].startSlot,
      endSlot: item.sequences[seq].endSlot,
      fullATLeaders: item.sequences.map((seq: any) => seq.ghLeader.replace(/\s*\(.*\)$/, "")).join('#')
    };

    retorno.push(row);
  });

  return retorno;
}