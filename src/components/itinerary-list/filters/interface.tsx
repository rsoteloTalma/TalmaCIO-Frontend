import { filterAll } from "../interface";

export interface FilterProps {
  open: boolean;
  handleClose: (openStatus: boolean) => void;
  dataFilters: filterAll | undefined;
  operation: number;
  handleFilter: (filter: Record<string, any>) => void;
}