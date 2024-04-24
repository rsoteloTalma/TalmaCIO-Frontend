export interface AcceptDialogProps {
  handleClose: () => void;
  dialogContentText: string;
  dialogTitle: string;
  handleAccept: (() => void) | null;
  open: boolean;
}