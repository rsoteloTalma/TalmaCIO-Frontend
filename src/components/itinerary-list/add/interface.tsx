import { filterAll } from "../interface";

export interface AddProps {
  open: boolean;
  handleClose: (openStatus: boolean) => void;
  dataFilters: filterAll | undefined;
  handleAdd: (success: any[]) => void;
}