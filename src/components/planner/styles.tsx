import { CSSProperties } from "react";

export const dataSheetGrid = (width: number): CSSProperties => ({
    width: width
});

export const containerSheetGrid = (height: number): CSSProperties => ({
    //height: height,
    overflow: "auto",
    overflowX: "auto"
});

