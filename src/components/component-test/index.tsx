// import React, { useState } from 'react';
// import {
//   DataSheetGrid,
//   checkboxColumn,
//   textColumn,
//   keyColumn,
//   Column
// } from 'react-datasheet-grid';
// import 'react-datasheet-grid/dist/style.css';

// interface DataRow {
//   active: boolean;
//   firstName: string | null;
//   lastName: string | null;
// }


// const ComponentTest: React.FC = () => {
//   const [data, setData] = useState<DataRow[]>([
//     { active: true, firstName: 'Elon', lastName: 'Musk' },
//     { active: false, firstName: 'Jeff', lastName: 'Bezos' },
//   ]);

//   const columns: Column<DataRow>[] = [
//     {
//       ...keyColumn<DataRow, 'active'>('active', checkboxColumn),
//       title: 'Active',
//     },
//     {
//       ...keyColumn<DataRow, 'firstName'>('firstName', textColumn),
//       title: 'First name',
//     },
//     {
//       ...keyColumn<DataRow, 'lastName'>('lastName', textColumn),
//       title: 'Last name',
//     },
//   ];


//   return (
//     <div style={{ height: '400px', overflow: 'auto' }}>
//       <DataSheetGrid
//         value={data}
//         onChange={setData}
//         columns={columns}
//       />
//     </div>
//   );
// };

// export default ComponentTest;
import React, { useState, useRef } from 'react';
import { Grid, Container } from "@mui/material";

import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  keyColumn,
  Column
} from 'react-datasheet-grid';
import { useVirtualizer } from '@tanstack/react-virtual';
import 'react-datasheet-grid/dist/style.css';

interface DataRow {
  active: boolean;
  firstName: string | null;
  lastName: string | null;
}

const ComponentTest: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    // Agrega más datos aquí para probar la virtualización
  ]);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Estima el tamaño de cada fila
  });

  const columns: Column<DataRow>[] = [
    {
      ...keyColumn<DataRow, 'active'>('active', checkboxColumn),
      title: 'Active',
    },
    {
      ...keyColumn<DataRow, 'firstName'>('firstName', textColumn),
      title: 'First name',
    },
    {
      ...keyColumn<DataRow, 'lastName'>('lastName', textColumn),
      title: 'Last name',
    },
  ];

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                <div
                  key={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <DataSheetGrid
                    value={[data[virtualRow.index]]}
                    onChange={(newData) => {
                      const updatedData = [...data];
                      updatedData[virtualRow.index] = newData[0];
                      setData(updatedData);
                    }}
                    columns={columns}
                  />
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ComponentTest;
