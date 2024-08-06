import * as XLSX from "xlsx";

export async function downloadPlanner(params: any[]) {
  const data: any[] = [];
  const addTextName = getFormattedDate();

  params.forEach((item) => {
    data.push({
      serviceHeader: item.serviceHeaderId,
      base: item.base,
      tipoServicio: (item.serviceTypeStageId == 1) ? "TRANSITO" : "PERNOCTA",
      aerolinea: item.company,
      aeronave: item.aircraft,
      equipajeLlegando: item.incomingBaggageValue,
      unidadEL: item.incomingBaggageUnit,
      cargaLlegando: item.incomingCargoValue,
      unidadCL: item.incomingCargoUnit,
      banda: item.conveyor,
      origen: item.origin,
      numeroVueloOrigen: item.incomingFlight,
      sta: `${item.sta} ${item.staTime}`,
      ata: (item.ata) ? `${item.ata} ${item.ataTime}` : "-",
      gateLlegada: item.gate,
      atLider: item.fullATLeaders,
      paxLider: item.sPaxLeader,
      aop: item.aopLeader,
      gateSalida: item.gateDep,
      atd: (item.atd) ? `${item.atd} ${item.atdTime}` : "-",
      std: `${item.std} ${item.stdTime}`,
      numeroVueloDestino: item.outgoingFlight,
      destino: item.destiny,
      equipajeSaliendo: item.outgoingBaggageValue,
      unidadES: item.outgoingBaggageUnit,
      cargaSaliendo: item.outgoingCargoValue,
      unidadCS: item.outgoingCargoUnit,
      observaciones: (item.comments) ? "" : item.comments,
      apuInop: (item.apu) ? "SI" : "NO"
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Planeador_${addTextName}`);
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = `${params[0].base}${addTextName}.xlsx`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return {
    success: true,
    message: "download OK"
  };
}


function getFormattedDate(): string {
  const now = new Date();

  //const year = now.getFullYear();
  const year = String(now.getFullYear()).slice(-2); 
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}`;
}
