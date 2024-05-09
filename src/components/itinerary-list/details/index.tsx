import React from "react";
import { Avatar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import { Close, DeleteForever, East, EditNote, Flight, FlightLand, FlightTakeoff, KeyboardArrowRight, Numbers, PinDrop } from "@mui/icons-material";
import { blue, blueGrey, red } from "@mui/material/colors";

import { DetailsProps } from "./interface";

const ItineraryDetails: React.FC<DetailsProps> = ({ open, data, handleClose, handleDelete, handleEdit }) => {
  const sta = data.sta?.split("T");
  const std = data.std?.split("T");

  const handleDeleteItinerary = (item: number) => {
    handleDelete({ itineraryElementId: item });
    handleClose(false);
  }

  const handleEditItinerary = () => {
    handleEdit(data);
    handleClose(false);
  }

  if (Object.keys(data).length === 0) { return false; }

  return (
    <Drawer anchor="right" open={open} onClose={() => handleClose(false)} PaperProps={{ sx: { width: "25%" } }} >
      <Box role="presentation">
        <List sx={{bgcolor: "#FAFAFA", padding:0}}>
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="close" onClick={() => handleClose(false)}>
                <Close />
              </IconButton>
            }
          >
            <ListItemText
              primary={data.itineraryElementId}
              secondary="Itinerario"
            />
          </ListItem>
        </List>

        <Box>
          <Stack direction="column" alignItems="center" margin={2}>
            <Avatar sx={{ width: 45, height: 45, bgcolor: "#1A3072" }}>
              <PinDrop />
            </Avatar>
            <ListItemText
              primary={
                <Typography variant="h5" textAlign="center">
                  {data.base.description}
                </Typography>
              }
              secondary="Estación"
              secondaryTypographyProps={{ align: "center" }}
            />
          </Stack>

          <Divider sx={{ marginX: 2 }} />

          <List>
            { data.serviceHeaderId !== null &&
            <ListItem divider={true} dense={true} >
              <ListItemIcon>
                <Numbers />
              </ListItemIcon>
              <ListItemText primary={data.serviceHeaderId} secondary="Cód. CIO" />
            </ListItem>
            }

            <ListItem divider={true} dense={true} >
              <ListItemIcon>
                <East />
              </ListItemIcon>
              <ListItemText primary={data.serviceType.description} secondary="Tipo de Servicio" />
            </ListItem>

            <ListItem divider={true} dense={true} >
              <ListItemIcon>
                <East />
              </ListItemIcon>
              <ListItemText primary={`Gate ${data.gate?.description ?? ""}`} secondary={`Terminal ${data.terminal}`} />
            </ListItem>
            <ListItem
              divider={true}
              dense={true}
              secondaryAction={
                <img
                  alt={`${data.company.description} Flag`}
                  src={`https://content.airhex.com/content/logos/airlines_${data.company.description}_100_30_r.png`}
                />
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blueGrey[200] }}><Flight /></Avatar>
              </ListItemAvatar>
              <ListItemText primary={data.company.description} secondary={data.aircraft?.description ?? ""} />
            </ListItem>

            <ListItem 
              divider={true}
              dense={true}
              secondaryAction={
                <Typography variant="body2" textAlign="end">
                  {sta[0]} <br /> {sta[1].slice(0, 5)}
                </Typography>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blueGrey[200] }}><FlightLand /></Avatar>
              </ListItemAvatar>
              <ListItemText primary={data.origin?.description ?? ""} secondary={data.incomingFlight ?? ""} />
            </ListItem>
            <ListItem 
              divider={true}
              dense={true}
              secondaryAction={
                <Typography variant="body2" textAlign="end">
                  {std[0]} <br /> {std[1].slice(0, 5)}
                </Typography>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blueGrey[200] }}><FlightTakeoff /></Avatar>
              </ListItemAvatar>
              <ListItemText primary={data.destiny?.description ?? ""} secondary={data.outgoingFlight ?? ""} />
            </ListItem>

            <ListItem
              divider={true}
              dense={true}
              disablePadding
              secondaryAction={
                <IconButton edge="end" aria-label="link">
                  <KeyboardArrowRight />
                </IconButton>
              }
            >
              <ListItemButton 
                //onClick={handleClick}
              >
                <ListItemText primary="VER" secondary="En boletín" />
              </ListItemButton>
            </ListItem>
            <ListItem
              divider={true}
              dense={true}
              disablePadding
              secondaryAction={
                <IconButton edge="end" aria-label="link">
                  <KeyboardArrowRight />
                </IconButton>
              }
            >
              <ListItemButton 
                //onClick={handleClick}
              >
                <ListItemText primary="VER" secondary="En línea de tiempo" />
              </ListItemButton>
            </ListItem>

            {data.serviceHeaderId === null && (
              <>
              <ListItem
                dense={true}
                disablePadding
                secondaryAction={
                  <IconButton edge="end" aria-label="link">
                    <KeyboardArrowRight />
                  </IconButton>
                }
                sx={{bgcolor: blue[200] }}
              >
                <ListItemButton 
                  onClick={handleEditItinerary}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blue[400] }}><EditNote /></Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="EDITAR" secondary="Itinerario" sx={{color: "white"}} />
                </ListItemButton>
              </ListItem>

              <ListItem
                divider={true}
                dense={true}
                disablePadding
                secondaryAction={
                  <IconButton edge="end" aria-label="link">
                    <KeyboardArrowRight />
                  </IconButton>
                }
                sx={{bgcolor: red[300] }}
              >
                <ListItemButton 
                  onClick={() => handleDeleteItinerary(data.itineraryElementId)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: red[600] }}><DeleteForever /></Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="ELIMINAR" secondary="Itinerario" sx={{color: "white"}} />
                </ListItemButton>
              </ListItem>
              </>
            )}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}

export default ItineraryDetails;
