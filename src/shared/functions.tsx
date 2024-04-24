import moment from "moment";

export function processErrorMessage(message: string): string {
    const complementMsj = "Valide con el área de tecnología.";

    if (message.indexOf("Empleado no encontrado") !== -1){  
        return "Colaborador no encontrado en el sistema. " + complementMsj;
    }
    if (message.indexOf("Empleado no activo") !== -1){
        return "No te encuentras activo en el sistema. " + complementMsj;
    }
    if (message.indexOf("Empleado no ha cambiado clave") !== -1){
        return "Colaborador no ha cambiado su clave por defecto. " + complementMsj;
    } 
    if (message.indexOf("Verifique sus datos") !== -1){
        return "Datos de validación errados. " + complementMsj;
    }   
    return "";
}

export const zeroFill = (number: number | string, width: number): string => {
    width -= number.toString().length;
    if (width > 0) {
        return new Array( width + (/\./.test( number.toString() ) ? 2 : 1) ).join( "0" ) + number;
    }
    return number + "";
};

export const FormatDateToStringComplete = (value: string): string | null => {
    if (!value){
        return null;
    }
    const year = value.split("-")[0];
    const month = value.split("-")[1];
    const day = value.split("-")[2].substring(0,2);
    return `${zeroFill(day, 2)}/${zeroFill(month, 2)}/${year}`; 
};

export const FormatDateTimeToStringComplete = (value: string, convertToLocal?: boolean): string | null => {
    if (!value){
        return null;
    }

    if (!convertToLocal) {
        const year = value.split("-")[0];
        const month = value.split("-")[1];
        const day = value.split("-")[2].substring(0,2);
        const complement = value.split("-")[2].substring(3,value.split("-")[2].length - 3);
        return `${zeroFill(day, 2)}/${zeroFill(month, 2)}/${year} ${complement}`; 
    }
     
    const local = moment.utc(value).local().format();
    const year = local.split("-")[0];
    const month = local.split("-")[1];
    const day = local.split("-")[2].substring(0,2);
    const complement = local.split("-")[2].substring(3,local.split("-")[2].length - 3);
    return `${zeroFill(day, 2)}/${zeroFill(month, 2)}/${year} ${complement}`; 
};

export const FormatCurrency = (value: number): string => {
    return (new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
      }).format(value));
};

export const FormatPercentage = (value: number): string => {
    return (new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value/100));
};

export const CreateGuid = (): string => {  
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {  
       const r = Math.random()*16|0, v = c === "x" ? r : (r&0x3|0x8);  
       return v.toString(16);  
    });  
};

type Filter = { [key: string]: any };
export const buildUrl = (value: Filter[]): string => {
    const queryString = value
        .map(filter => {
            return Object.keys(filter)
                .map(key => {
                    return encodeURIComponent(key) + "=" + encodeURIComponent(filter[key]);
                }).join("&");
        }).join("&");

    return queryString;
};
