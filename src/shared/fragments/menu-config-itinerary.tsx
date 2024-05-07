import React, { useState } from "react";
import { FormControlLabel, IconButton, Menu, MenuItem, Switch } from "@mui/material";

import { MoreVert } from "@mui/icons-material";

interface ConfigProps {
  params: Record<string, any>;
  handleConfigAction: (data: any) => void;
}


const MenuConfig: React.FC<ConfigProps> = ({ params, handleConfigAction }) => {

  const [prepare, setPrepare] = useState<boolean>(params.prepare);
  const [selection, setSelection] = useState<boolean>(params.selection);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePrepare = () => {
    setPrepare(!prepare);
    handleConfigAction({prepare});
  };

  const handleSelection = () => {
    setSelection(!selection);
    handleConfigAction({selection: !selection});
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{textAlign: "center"}}
      >
        <MenuItem>
          <FormControlLabel
            checked={prepare}
            control={<Switch color="primary" size="small" onClick={handlePrepare} />}
            label="Preparar"
            labelPlacement="end"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            checked={selection}
            control={<Switch color="primary" size="small" onClick={handleSelection} />}
            label="Selección"
            labelPlacement="end"
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default MenuConfig;




