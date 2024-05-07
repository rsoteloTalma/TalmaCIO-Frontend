export interface DetailsProps {
  open: boolean;
  data: Record<string, any>;
  handleClose: (openStatus: boolean) => void;
  handleDelete: (success: Record<string, number>) => void;
}

export interface DetailsDataProps {
  itineraryElementId: number;
  serviceHeaderId: number | null;
  serviceType: {
    id: number;
    description: string;
  };
  base: {
    id: number;
    description: string;
  };
  company: {
    id: number;
    description: string;
    extra: string;
  };
  aircraftType: null;
  origin: {
    id: number;
    description: string;
  };
  destiny: {
    id: number;
    description: string;
  };
  aircraft: {
    id: number;
    description: string;
  };
  incomingFlight: string;
  outgoingFlight: string;
  sta: string;
  std: string;
  observation: string | null;
  creatorUser: string;
  created: string;
  fileId: number;
  filePath: string;
  leaders: any[];
  action: number;
}
