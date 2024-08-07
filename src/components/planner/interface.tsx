export interface DataRow {
  serviceHeaderId: any | null;
  baseId: number | null;
  base: string | null;
  destinyId: number | null;
  destiny: string | null;
  originId: number | null;
  origin: string | null;
  companyId: number
  company: string | null;
  companyLogo: string | null;
  aircraftId: number | null;
  aircraft: string | null;
  aircraftType: string | null;
  conveyorId: number | null;
  conveyor: string | null;
  outgoingFlight: string | null;
  incomingFlight: string | null;
  flow: string | null;
  controlAtOrigin: string | null;
  crewChange: string | null;
  charter: boolean;
  incomingCargoValue: string | null;
  incomingCargoUnit: string | null;
  outgoingCargoValue: string | null;
  outgoingCargoUnit: string | null;
  incomingBaggageValue: string | null;
  incomingBaggageUnit: string | null;
  outgoingBaggageValue: string | null;
  outgoingBaggageUnit: string | null;
  sta: string | null;
  staTime: string | null;
  std: string | null;
  stdTime: string | null;
  eta: string | null;
  etd: string | null;
  ata: string | null;
  ataTime: string | null;
  atd: string | null;
  atdTime: string | null;
  cancelledDepartureFlightNumber: string | null;
  comments: string | null;
  cancelledFlight: boolean;
  realEnd: string | null;
  realStart: string | null
  sPaxLeaderId: number | null;
  sPaxLeader: string | null;
  aopLeaderId: number | null;
  aopLeader: string | null;
  apu: boolean;
// list
  slotSequence: any | null;
  gateId: number | null;
  gate: string | null;
  gateDepId: number | null;
  gateDep: string | null;
  serviceTypeStageId: number | null;
  serviceTypeStage: string | null;
  ghLeaderId: number | null;
  ghLeader: string | null;
  fullATLeaders: string | null;
  startDate: string | null;
  endDate: string | null;
}
