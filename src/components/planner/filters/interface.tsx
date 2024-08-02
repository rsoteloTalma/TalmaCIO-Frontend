export interface FilterProps {
  open: boolean;
  handleClose: (openStatus: boolean) => void;
  handleFilter: (filter: Record<string, any>) => void;
  airports: any | undefined;
}