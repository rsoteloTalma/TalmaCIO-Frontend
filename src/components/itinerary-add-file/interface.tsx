export interface ItineraryRequest {
  FileName: string;
  File: string;
  User: string;
  Data: ItineraryData[];
}

export interface ItineraryData {
  ElementId: number;
  Base: string;
  AirlineIATA: string;
  ServiceType: string;
  Registration: string;
  AircraftType: string | null;
  Origin: string;
  IncomingFlight: string;
  Destiny: string;
  OutgoingFlight: string;
  EstimatedTimeArrival: Date;
  EstimatedTimeDeparture: Date;
  Terminal: string;
  Gate: string;
  Conveyor: string;
  Observation: string;
  Leaders: Leaders
}

interface Leaders {
  EmployeeId: string;
  Type: number;
}
