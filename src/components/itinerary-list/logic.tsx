import { callAPI } from "../../shared/network";


export async function getItineraryFilters() {
  const data = await callAPI(
    null,
    "Itinerary/GetItineraryFilters", "get");

  return data.data || [];
}

export async function getItineraryRecords(filters: Record<string, any>) {
  for (const key in filters) {
    if(key != "End" && key != "Start"){
      if(filters[key].length < 1){
        delete filters[key];
        continue;
      }

      const type = filters[key].every((item: any) => typeof item === "string");
      if(type) {
        continue;
      } else {
        filters[key] = filters[key].map((item: any) => item.id);
      }
    }
  }

  const params = capitalizeKeys(filters);
  const data = await callAPI(
    params, 
    "Itinerary/GetItinerary", "post");

  return data.data || [];
}

export async function deleteItinerary(params: Record<string, any>) {
  const data = await callAPI(
    params,
    "Itinerary/DeleteByElementItineraryId", "delete");

  return true;
}

const capitalizeKeys = (obj: any) => {
  const newObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      newObj[capitalizedKey] = obj[key];
    }
  }
  return newObj;
}
