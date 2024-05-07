// Example locale file for English, give this to your locale team to translate

export const AG_GRID_LOCALE_ES: Record<string,string> = {
    // Set Filter
    selectAll: "(Seleccionar Todo)",
    selectAllSearchResults: "(Select All Search Results)",
    addCurrentSelectionToFilter: "Agregar selección actual para filtrar",
    searchOoo: "Buscar...",
    blanks: "(En blanco)",
    noMatches: "No hay coincidencias",

    // Number Filter & Text Filter
    filterOoo: "Filtrar...",
    equals: "Igual",
    notEqual: "No es igual",
    blank: "En blanco",
    notBlank: "Not blank",
    empty: "Elige uno",

    // Number Filter
    lessThan: "Menor que",
    greaterThan: "Mayor que",
    lessThanOrEqual: "Menor o igual que",
    greaterThanOrEqual: "Mayor o igual que",
    inRange: "En rango de",
    inRangeStart: "Desde",
    inRangeEnd: "Hasta",

    // Text Filter
    contains: "Contiene",
    notContains: "No contiene",
    startsWith: "Inicia con",
    endsWith: "Termina con",

    // Date Filter
    dateFormatOoo: "yyyy-mm-dd",
    before: "Before",
    after: "After",

    // Filter Conditions
    andCondition: "Y",
    orCondition: "O",

    // Filter Buttons
    applyFilter: "Apply",
    resetFilter: "Reestablecer",
    clearFilter: "Limpiar",
    cancelFilter: "Cancelar",


    // Filter Titles
    textFilter: "Text Filter",
    numberFilter: "Number Filter",
    dateFilter: "Date Filter",
    setFilter: "Set Filter",

    // Group Column Filter
    groupFilterSelect: "Select field:",

    // Side Bar
    columns: "Columns",
    filters: "Filters",

    // Header of the Default Group Column
    group: "Group",

    // Row Drag
    rowDragRow: "row",
    rowDragRows:"rows",

    // Number Format (Status Bar, Pagination Panel)
    thousandSeparator: ",",
    decimalSeparator: ".",

    // Data types
    true: "True",
    false: "False",
    invalidDate: "Invalid Date",
    invalidNumber: "Invalid Number",
    january: "Enero",
    february: "Febrero",
    march: "Marzo",
    april: "Abril",
    may: "Mayo",
    june: "Junio",
    july: "Julio",
    august: "Agosto",
    september: "Septiembre",
    october: "Octubrer",
    november: "Noviembre",
    december: "Diciembre",

    // Time formats
    timeFormatSlashesDDMMYYYY: "DD/MM/YYYY",
    timeFormatSlashesMMDDYYYY: "MM/DD/YYYY",
    timeFormatSlashesDDMMYY: "DD/MM/YY",
    timeFormatSlashesMMDDYY: "MM/DD/YY",
    timeFormatDotsDDMYY: "DD.M.YY",
    timeFormatDotsMDDYY: "M.DD.YY",
    timeFormatDashesYYYYMMDD: "YYYY-MM-DD",
    timeFormatSpacesDDMMMMYYYY: "DD MMMM YYYY",
    timeFormatHHMMSS: "HH:MM:SS",
    timeFormatHHMMSSAmPm: "HH:MM:SS AM/PM",
}

export const AG_GRID_LOCALE_ZZZ: Record<string, string> = {};

Object.keys(AG_GRID_LOCALE_ES).forEach(function(key) {
    if (key === "thousandSeparator" || key === "decimalSeparator") { return; }
    AG_GRID_LOCALE_ZZZ[key] = "zzz-" + AG_GRID_LOCALE_ES[key];
});
