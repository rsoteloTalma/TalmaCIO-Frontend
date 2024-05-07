import { callAPI } from "../../../shared/network";

const programmingState = ["Error", "Exito", "Info", "Alerta"];


export async function GetAircraftByCompany(id: number) {
  const data = await callAPI(
    {id}, 
    "Reference/GetAircraftByCompanyId", "get");

  return data.data || {};
}


export async function GetGateByAirport(id: number) {
  const data = await callAPI(
    {id}, 
    "Reference/GetGateByAirportId", "get");

  return data.data || {};
}


export async function GetConveyorByAirport(id: number) {
  const data = await callAPI(
    {id}, 
    "Reference/GetConveyorByAirportId", "get");

  return data.data || {};
}

export async function AddItinerary(fields: Record<string, any>) {
  const user: string = fields.user;
  delete fields.user;

  const itinerary: any[] = [fields];
  const params = {
    user: user,
    data: itinerary
  };

  const data = await callAPI(
    params,
    "Itinerary/AddItinerary", "post");

  return data.data || {success: 0};
}


export async function formatAlerts(records: any[], type: number) {
  const alerts: any = [];

  records.forEach((element) => {
    const segments = element.split("_");
    const descriptions = segments[1].split(/\s*\|\s*/);

    descriptions.forEach((alert: string) => {
      alerts.push({
        id: segments[0],
        description: alert.trim(),
        type: programmingState[type]
      });
    });
  });

  return alerts;
}
