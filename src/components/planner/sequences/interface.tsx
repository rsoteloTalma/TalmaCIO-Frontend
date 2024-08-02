export interface SequenceProps {
  open: boolean;
  data: Record<string, any>;
  gate: any[];
  leadersList: any[];
  handleClose: (openStatus: boolean) => void;
  handleSequences: (data: Record<string, any>) => void;
}
