import { callAPI } from "../../../shared/network";
import { getUser } from "../../../shared/auth-service";

const user = getUser();

const programmingState = ["Error", "Exito", "Info", "Alerta"];

export async function sendItineraryTransfer(fields: Record<string, any>) {
  const params = {
    user: user.employeeId,
    elementItineraryId: fields
  };

  const data = await callAPI(
    params,
    "TimeLine/CreateTimelineFromItinerary", "post");

  return data.data;
}


export async function sendItineraryTransferUnit(idItinerary: number) {
  const params = {
    user: user.employeeId,
    elementItineraryId: [idItinerary]
  };

  const data = await callAPI(
    params,
    "TimeLine/CreateTimelineFromItinerary", "post");

  return data.data[0];
}


export function formatAlerts(records: any[], type: number) {
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


export async function segmentList(list: any, max: number) {
  const listReturn = [];
  for (let i = 0; i < list.length; i += max) {
    listReturn.push(list.slice(i, i + max));
  }
  return listReturn;
}


export async function fireSocket() {
  const params = {
    invokedFrom: "TransferItinerary"
  };

  const data = await callAPI(
    params,
    "Planner/Socket", "post");

  return true;
}


export async function transferSimulator(idItinerary: number) {
  return await esperar(idItinerary);
}


function esperar(id: number) {
  const lista = (id == 654075) ? ["hay error"] : [];
  const header = (id == 654075) ? null : 123;

  return new Promise(resolve => {
      setTimeout(() => {
          resolve({
            "elementItineraryId": id,
            "serviceHeaderId": header,
            "errors": lista
          });
      }, 2000);
  });
}
