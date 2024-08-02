export interface GridSettingsProps {
  open: boolean;
  data: any[];
  handleClose: (openStatus: boolean) => void;
  handleDefineGrid: (data: any[]) => void;
}
