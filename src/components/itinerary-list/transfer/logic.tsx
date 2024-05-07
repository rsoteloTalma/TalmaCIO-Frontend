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

