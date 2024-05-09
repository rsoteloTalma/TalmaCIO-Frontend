import moment from "moment-timezone";
import { callAPI } from "../../shared/network";
import { ItineraryData, ItineraryRequest } from "./interface";
import { getUser } from "../../shared/auth-service";

const user = getUser();

const timeZone = "America/Bogota";
const programmingState = ["Error", "Exito", "Info", "Alerta"];

const numberToDate = (excelNumber: number) => {
  const msSinceUnixEpoch = (excelNumber - 25569) * 86400 * 1000;
  const momentDate = moment(msSinceUnixEpoch).tz(timeZone);
  return momentDate.format("YYYY-MM-DD HH:mm:ss");
};


const fileToBase64 = (file: File) => {
  const reader = new FileReader();

  reader.readAsDataURL(file);

  return new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const base64Data = reader.result.split(",")[1];
        resolve(base64Data);
      } else {
        reject(new Error("Error al leer el archivo"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"));
    };
  });
};


export async function processRecords(records: any[], file: File) {
  const data: any = [];

  records.forEach((element, index) => {
    const Leader: any = [];
    const separator = " ";

    if(element.LiderAT && element.LiderAT != ""){
      const identification = String(element.LiderAT);
      const LeadAT = (identification.includes(separator)) ? identification.split(separator) : [identification];

      if(LeadAT.length > 0){
        LeadAT.map((lead: string) => {
          Leader.push({ EmployeeId: lead.trim(), Type: 96 });
        });
      }
    }

    if(element.LiderPAX && element.LiderPAX != ""){
      const identification = String(element.LiderPAX);
      const LeadPAX = (identification.includes(separator)) ? identification.split(separator) : [identification];

      if(LeadPAX.length > 0){
        LeadPAX.map((lead: string) => {
          Leader.push({ EmployeeId: lead.trim(), Type: 97 });        
        });
      }
    }

    if(element.AOP && element.AOP != ""){
      const identification = String(element.AOP);
      const LeadAOP = (identification.includes(separator)) ? identification.split(separator) : [identification];

      if(LeadAOP.length > 0){
        LeadAOP.map((lead: string) => {
          Leader.push({ EmployeeId: lead.trim(), Type: 98 });
        });
      }
    }

    if(element.ETA && element.ETD) {
      if(typeof element.ETA === "string") {
        const fecha = moment.tz(element.ETA, "YYYY-MM-DD HH:mm", timeZone);
        if (fecha.isValid()) {
          element.ETA = fecha.format();
        }
      } else {
        element.ETA = new Date(numberToDate(element.ETA));  
      }

      if(typeof element.ETD === "string") {
        const fecha = moment.tz(element.ETD, "YYYY-MM-DD HH:mm", timeZone);
        if (fecha.isValid()) {
          element.ETD = fecha.format();
        }
      } else {
        element.ETD = new Date(numberToDate(element.ETD));
      }
    }

    if(element.ETA && (!element.ETD || element.ETD == "Invalid Date")) {
        element.ETA = new Date(numberToDate(element.ETA));
        const momentDate = moment(element.ETA).tz(timeZone).add(8, "hours").format("YYYY-MM-DD HH:mm:ss");
        element.ETD = new Date(momentDate);

        if(element.Observacion){
          element.Observacion = `${element.Observacion} - ETD(default)`;
        } else {
          element.Observacion = "ETD(default)";
        }
    }

    if(element.ETD && (!element.ETA || element.ETA == "Invalid Date")) {
      element.ETD = new Date(numberToDate(element.ETD));
      const momentDate = moment(element.ETD).tz(timeZone).subtract(8, "hours").format("YYYY-MM-DD HH:mm:ss");
      element.ETA = new Date(momentDate);

      if(element.Observacion){
        element.Observacion = `${element.Observacion} - ETA(default)`;
      } else {
        element.Observacion = "ETA(default)";
      }
    }

    const record: ItineraryData = {
      ElementId: Number(index+=1),
      Base: element.Base,
      AirlineIATA: element.IATA,
      ServiceType: element.TipoServicio,
      Registration: element.Matricula ?? "",
      AircraftType: null,
      Origin: element.Origen ?? "",
      IncomingFlight: String(element.VueloLlegando) ?? "",
      Destiny: element.Destino ?? "",
      OutgoingFlight: String(element.VueloSaliendo) ?? "",
      EstimatedTimeArrival: element.ETA,
      EstimatedTimeDeparture: element.ETD,
      Terminal: element.Terminal != null ? element.Terminal.toString() : "",
      Gate: element.Gate != null ? element.Gate.toString() : "",
      Conveyor: element.Banda ?? "",
      Observation: element.Observacion ?? "",
      Leaders: Leader
    }

    data.push(record);
  });

  const fileBase64 = await fileToBase64(file);
  const sendFile: ItineraryRequest = {
    FileName: file.name,
    File: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileBase64}`,
    User: user.employeeId,
    Data: data
  }

  return sendFile;
}


export async function validationFields(records: any[]) {
  const defaultServiceTypes = ["TRANSITO", "PERNOCTA", "ATENCION CARGUERO", "RETENCION / OMA", "RETENCION/OMA", "RETENCION" ];
  const alerts: any = [];
  const errors: any = [];

  let row = 0;
  records.forEach((element, index) => {
    row = (index += 2);

    if (!element.Base?.trim()) {
      const message = `${row}_Base sin indicar`;
      errors.push(message);
    }

    const baseCheck = user.setAirports.find((item: any) => item.code === element.Base);
    if (!baseCheck) {
      const message = `${row}_Base no permitida`;
      errors.push(message);
    }

    if (!element.IATA?.trim()) {
      const message = `${row}_Aerolínea sin indicar`;
      errors.push(message);
    }

    if (!element.TipoServicio?.trim()) {
      const message = `${row}_Tipo de Servicio sin indicar`;
      errors.push(message);

    } else {
      const valueType = element.TipoServicio.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      if (!defaultServiceTypes.map(item => item.toLowerCase()).includes(valueType.toLowerCase())) {
        const message = `${row}_Tipo de Servicio incorrecto`;
        errors.push(message);
      }
    }

    if ((!element.VueloLlegando) && (!element.VueloSaliendo)) {
      const message = `${row}_Vuelo Llegada y Salida sin indicar`;
      errors.push(message);
    }
    
    if (element.Origen?.trim()) {
      if (!element.VueloLlegando) {
        const message = `${row}_Vuelo Llegando sin indicar`;
        errors.push(message);
      }
      if (!element.ETA) {
        const message = `${row}_Fecha Llegando sin indicar`;
        errors.push(message);
      }
    }

    if (element.Destino?.trim()) {
      if (!element.VueloSaliendo) {
        const message = `${row}_Vuelo Saliendo sin indicar`;
        errors.push(message);
      }
      if (!element.ETD) {
        const message = `${row}_Fecha Saliendo sin indicar`;
        errors.push(message);
      }
    }

    // ALERTS
    if (!element.Matricula) {
      const message = `${row}_Matrícula sin indicar`;
      alerts.push(message);
    }

    if (!element.Terminal) {
      const message = `${row}_Terminal sin indicar`;
      alerts.push(message);
    }

    if (!element.Gate) {
      const message = `${row}_Gate sin indicar`;
      alerts.push(message);
    }

    if(!element.ETA || element.ETA == "Invalid Date") {
      const message = `${row}_ETA sin indicar`;
      alerts.push(message);
    }

    if(!element.ETD || element.ETD == "Invalid Date") {
      const message = `${row}_ETD sin indicar`;
      alerts.push(message);
    }
  });

  const success = (errors.length > 0) ? true: false;
  return { success, alerts, errors };
}


export async function formatAlerts(records: any[], type: number) {
  const alerts: any = [];

  records.forEach((element) => {
    const segments = element.split("_");
    const descriptions = segments[1].split(/\s*\|\s*/);

    descriptions.forEach((alert: string) => {
      alerts.push({
        id: segments[0],
        description: alert.trim(),
        type: programmingState[type]
      });
    });
  });

  return alerts;
}


export async function sendDataFile(params: ItineraryRequest) {
  const data = await callAPI(
    params, 
    "Itinerary/MassiveItinerary", "post");

  return data.data || {};
}
