export interface filterAll {
  aircraftTypes: filterData;
  airlines: filterData;
  airports: filterData;
  serviceTypes: filterData;
}

export interface filterData {
  id: number;
  description: string;
  extra: string | null;
}
