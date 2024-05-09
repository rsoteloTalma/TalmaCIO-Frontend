import { callAPI } from "../../../shared/network";

export async function EditItinerary(params: Record<string, any>) {
  const send = await callAPI(
    params,
    "Itinerary/UpdateItinerarySpecificFields", "put");

    const { data } = send;
    const result = (data.success == 1) ? data.data : data.errors[0];
    return result;
}
