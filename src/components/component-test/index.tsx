// import React, { useState } from "react";

// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";


// const ComponentTest = () => {
//   const [columnDefs, setColumnDefs] = useState<any[]>([
//     { field: "athlete" },
//     { field: "country" },
//     { field: "sport" },
//     { field: "age", minWidth: 100 },
//     { field: "gold", minWidth: 100 },
//     { field: "silver", minWidth: 100 },
//     { field: "bronze", minWidth: 100 },
//   ]);

//   const [rowData, setRowData] = useState<any[]>([
//     {
//         "athlete": "Michael Phelps",
//         "age": 23,
//         "country": "United States",
//         "year": 2008,
//         "date": "24/08/2008",
//         "sport": "Swimming",
//         "gold": 8,
//         "silver": 0,
//         "bronze": 0,
//         "total": 8
//     },
//     {
//         "athlete": "Michael Phelps",
//         "age": 19,
//         "country": "United States",
//         "year": 2004,
//         "date": "29/08/2004",
//         "sport": "Swimming",
//         "gold": 6,
//         "silver": 0,
//         "bronze": 2,
//         "total": 8
//     },
//     {
//         "athlete": "Michael Phelps",
//         "age": 27,
//         "country": "United States",
//         "year": 2012,
//         "date": "12/08/2012",
//         "sport": "Swimming",
//         "gold": 4,
//         "silver": 2,
//         "bronze": 0,
//         "total": 6
//     },
//     {
//         "athlete": "Natalie Coughlin",
//         "age": 25,
//         "country": "United States",
//         "year": 2008,
//         "date": "24/08/2008",
//         "sport": "Swimming",
//         "gold": 1,
//         "silver": 2,
//         "bronze": 3,
//         "total": 6
//     },
//     {
//         "athlete": "Aleksey Nemov",
//         "age": 24,
//         "country": "Russia",
//         "year": 2000,
//         "date": "01/10/2000",
//         "sport": "Gymnastics",
//         "gold": 2,
//         "silver": 1,
//         "bronze": 3,
//         "total": 6
//     },
//     {
//         "athlete": "Alicia Coutts",
//         "age": 24,
//         "country": "Australia",
//         "year": 2012,
//         "date": "12/08/2012",
//         "sport": "Swimming",
//         "gold": 1,
//         "silver": 3,
//         "bronze": 1,
//         "total": 5
//     }
//   ]);

//   return (
//       <div className="example-wrapper">
//         <div
//             className="ag-theme-quartz"
//             style={{ height: 500 }}
//           >
//           <AgGridReact
//             rowData={rowData}
//             columnDefs={columnDefs}
//           />

//         </div>
//       </div>    
//   );
// }

// export default ComponentTest;



//////////////////// select en celdas
// import React, { useState } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import { ISelectCellEditorParams, ModuleRegistry, ClientSideRowModelModule } from "ag-grid-community";
// // import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

// ModuleRegistry.register(ClientSideRowModelModule);

// const languages = ["English", "Spanish", "French", "Portuguese", "(other)"];

// const ComponentTest = () => {
//   const [columnDefs, setColumnDefs] = useState<any[]>([
//     { field: "athlete" },
//     { field: "country" },
//     { 
//       headerName: "Sport",
//       field: "sport",
//       editable: true,
//       cellEditor: "agSelectCellEditor",
//       cellEditorParams: {
//         values: languages,
//       } as ISelectCellEditorParams,
//     }
//   ]);

//   const [rowData, setRowData] = useState<any[]>([
//     {
//         "athlete": "Michael Phelps",
//         "age": 23,
//         "country": "United States",
//         "year": 2008,
//         "date": "24/08/2008",
//         "sport": "Swimming",
//         "gold": 8,
//         "silver": 0,
//         "bronze": 0,
//         "total": 8
//     },
//     {
//         "athlete": "Michael Phelps",
//         "age": 19,
//         "country": "United States",
//         "year": 2004,
//         "date": "29/08/2004",
//         "sport": "Swimming",
//         "gold": 6,
//         "silver": 0,
//         "bronze": 2,
//         "total": 8
//     },
//     {
//         "athlete": "Michael Phelps",
//         "age": 27,
//         "country": "United States",
//         "year": 2012,
//         "date": "12/08/2012",
//         "sport": "Swimming",
//         "gold": 4,
//         "silver": 2,
//         "bronze": 0,
//         "total": 6
//     },
//     {
//         "athlete": "Natalie Coughlin",
//         "age": 25,
//         "country": "United States",
//         "year": 2008,
//         "date": "24/08/2008",
//         "sport": "Swimming",
//         "gold": 1,
//         "silver": 2,
//         "bronze": 3,
//         "total": 6
//     },
//     {
//         "athlete": "Aleksey Nemov",
//         "age": 24,
//         "country": "Russia",
//         "year": 2000,
//         "date": "01/10/2000",
//         "sport": "Gymnastics",
//         "gold": 2,
//         "silver": 1,
//         "bronze": 3,
//         "total": 6
//     },
//     {
//         "athlete": "Alicia Coutts",
//         "age": 24,
//         "country": "Australia",
//         "year": 2012,
//         "date": "12/08/2012",
//         "sport": "Swimming",
//         "gold": 1,
//         "silver": 3,
//         "bronze": 1,
//         "total": 5
//     }
//   ]);

//   return (
//       <div className="example-wrapper">
//         <div
//             className="ag-theme-quartz"
//             style={{ height: 500 }}
//           >
//           <AgGridReact
//             rowData={rowData}
//             columnDefs={columnDefs}
//             defaultColDef={{ editable: true }}
//           />

//         </div>
//       </div>    
//   );
// }

// export default ComponentTest;


import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const ComponentTest = () => {
  const [columnDefs] = useState<any[]>([
    {
      headerName: "Athlete",
      field: "athlete",
      minWidth: 180,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
    },
    { field: "country" },
    { field: "year" },
    { field: "sport" },
    { field: "age" },
  ]);

  const [rowData] = useState<any[]>([
    {
        "athlete": "Michael Phelps",
        "age": 23,
        "country": "United States",
        "year": 2008,
        "date": "24/08/2008",
        "sport": "Swimming",
        "gold": 8,
        "silver": 0,
        "bronze": 0,
        "total": 8
    },
    {
        "athlete": "Michael Phelps",
        "age": 19,
        "country": "United States",
        "year": 2004,
        "date": "29/08/2004",
        "sport": "Swimming",
        "gold": 6,
        "silver": 0,
        "bronze": 2,
        "total": 8
    },
    {
        "athlete": "Michael Phelps",
        "age": 27,
        "country": "United States",
        "year": 2012,
        "date": "12/08/2012",
        "sport": "Swimming",
        "gold": 4,
        "silver": 2,
        "bronze": 0,
        "total": 6
    },
    {
        "athlete": "Natalie Coughlin",
        "age": 25,
        "country": "United States",
        "year": 2008,
        "date": "24/08/2008",
        "sport": "Swimming",
        "gold": 1,
        "silver": 2,
        "bronze": 3,
        "total": 6
    },
    {
        "athlete": "Aleksey Nemov",
        "age": 24,
        "country": "Russia",
        "year": 2000,
        "date": "01/10/2000",
        "sport": "Gymnastics",
        "gold": 2,
        "silver": 1,
        "bronze": 3,
        "total": 6
    },
    {
        "athlete": "Alicia Coutts",
        "age": 24,
        "country": "Australia",
        "year": 2012,
        "date": "12/08/2012",
        "sport": "Swimming",
        "gold": 1,
        "silver": 3,
        "bronze": 1,
        "total": 5
    }
  ]);

  return (
      <div className="example-wrapper">
        <div
            className="ag-theme-quartz"
            style={{ height: 500 }}
          >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            enableCellTextSelection={true}
          />
        </div>
      </div>
  );
}

export default ComponentTest;
