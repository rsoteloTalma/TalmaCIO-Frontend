import React, { useState } from "react";
import { Button, ButtonGroup, Menu, MenuItem, Typography } from "@mui/material";
import { AirplaneTicket, ArrowDropDown } from "@mui/icons-material";

import { ICellRendererParams } from "ag-grid-community";

const SplitButton: React.FC<ICellRendererParams> = (props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction1Click = () => {
    handleClose();
    console.log("Action 1:", props.data);
    // Aquí puedes realizar acciones adicionales con los datos de la fila.
  };

  return (
    <>
      <ButtonGroup variant="outlined" size="small" aria-label="Small button group" sx={{marginTop: "4px"}}>
      <Button
        key="details"
        aria-controls="details"
        //onClick={}
        color="primary"
      >
        <AirplaneTicket />
      </Button>
      <Button
        key="two"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        
        color="primary"
      >
        <ArrowDropDown />
      </Button>
      </ButtonGroup>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        sx={{margin: 0}}
      >
        <MenuItem onClick={handleAction1Click} sx={{ paddingY: 0}}>
          <Typography variant="overline">
            editar
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ paddingY: 0}}>
          <Typography variant="overline">
            ver
          </Typography>
        </MenuItem>
      </Menu>      
    </>
  );
};

export default SplitButton;
