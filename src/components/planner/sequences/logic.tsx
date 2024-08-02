import { callAPI } from "../../../shared/network";

import { Dayjs } from "dayjs";
import dayjs  from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Bogota");

export async function ValidateLeaders(params: any[], minTime: Dayjs, maxTime: Dayjs) {
  const tolerance = 60;
  const dateMinTime = dayjs(minTime).unix();
  const dateMaxTime = dayjs(maxTime).unix();

  const length = params.length;

  // validacion unica
  if(length == 1){
    const convert = await convertDate(params[0].startDate, params[0].endDate, true);

    if(convert.startDate > (dateMinTime + tolerance)){
      return {
        success: false,
        message: `Error en horario inicial de la secuencia: ${params[0].slotSequence}.`
      };
    }

    if(convert.endDate < (dateMaxTime - tolerance)){
      return {
        success: false,
        message: `Error en horario final de la secuencia: ${params[0].slotSequence}.`
      };
    }

    if(params[0].serviceTypeStageId > 1){
      return {
        success: false,
        message: `Hacen falta datos de secuencia en el servicio de tipo PERNOCTA: ${params[0].slotSequence}.`
      };
    }

    const localStartDate = params[0].startDate;
    const localEndDate = params[0].endDate;

    params[0].slotSequence = 1;
    params[0].startDate = localStartDate.subtract(5, "hour");
    params[0].endDate = localEndDate.subtract(5, "hour");

    return {
      success: true,
      message: "sequence OK"
    };
  }


  // valida horas extremos
  const convertExtreme = await convertDate(params[0].startDate, params[(length - 1)].endDate, true);

  if(params[0].serviceTypeStageId > 1){
    if(params[0].serviceTypeStageId != 2){
      return {
        success: false,
        message: `Error en el tipo de servicio de la primer secuencia: ${params[0].slotSequence}.`
      };
    }

    const seqPernocta = params.some(item => item.serviceTypeStageId === 3);
    if(!seqPernocta){
      return {
        success: false,
        message: `Error en los tipos de servicio para PERNOCTA.`
      };
    }
  }

  if(convertExtreme.startDate > (dateMinTime + tolerance)){
    return {
      success: false,
      message: `Error en horario inicial de la primer secuencia: ${params[0].slotSequence}.`
    };
  }

  if(convertExtreme.endDate < (dateMaxTime - tolerance)){
    return {
      success: false,
      message: `Error en horario final de la última secuencia: ${params[(length - 1)].slotSequence}.`
    };
  }


  let cont = 1;
  for (let index = 0; index < length; index++) {
    if(cont < length) {
      const convertRows = await convertDate(params[cont].startDate, params[index].endDate, true);

      if((convertRows.endDate > convertRows.startDate) 
        || ((convertRows.startDate + tolerance) < convertRows.endDate) 
        || ((convertRows.endDate + tolerance) < convertRows.startDate)) {

        return {
          success: false,
          message: `Error en horario inicial de la secuencia: ${params[cont].slotSequence}.`
        };
      }
    }

    cont += 1;
  }

  // Enumeracion de slotSequence
  for (let index = 0; index < length; index++) {
    const convertUtc = await convertDate(params[index].startDate, params[index].endDate);

    params[index].slotSequence = index + 1;
    params[index].startDate = convertUtc.startDate.subtract(5, "hour");
    params[index].endDate = convertUtc.endDate.subtract(5, "hour");
  }

  return {
    success: true,
    message: "sequences OK"
  };
}


export async function Sequences(params: Record<string, any>) {
  const receive = await callAPI(
    params,
    "Planner/UpdateSequences", "put");

  const { data } = receive;

  if(data.success > 1){
    console.log("response -> ", data);
    return [];
  }

  return data;
}


// functions
async function convertDate(startDate: any, endDate: any, unix = false) {
  if(dayjs.isDayjs(startDate)){
    console.log("days");
  } else {
    startDate = dayjs(startDate);
  }

  if(dayjs.isDayjs(endDate)){
    console.log("days");
  } else {
    endDate = dayjs(endDate);
  }

  if(unix){
    return {
      startDate: startDate.unix(),
      endDate: endDate.unix()
    };
  }

  return {
    startDate,
    endDate
  };
}
