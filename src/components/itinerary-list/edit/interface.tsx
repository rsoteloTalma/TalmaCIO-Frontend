export interface EditProps {
  open: boolean;
  data: Record<string, any>;
  handleClose: (openStatus: boolean) => void;
  handleEdit: (message: string) => void;
}
