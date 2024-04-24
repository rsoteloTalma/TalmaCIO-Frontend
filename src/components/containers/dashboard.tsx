import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Avatar,
    Box,
    Drawer,
    IconButton,
    List,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    ListItemButton,
    ListItem,
    Divider,
    Collapse,
    Tooltip,
    Menu,
    CssBaseline
} from "@mui/material";

import {
  ExpandLess,
  ExpandMore,
  ExitToApp,
  ChevronLeft,
  ChevronRight,
  MenuOpen
} from "@mui/icons-material";

import * as IconsMaterial from "@mui/icons-material";

import MuiAppBar from "@mui/material/AppBar";
import { styled, Theme, useTheme } from "@mui/material/styles";

import AcceptDialog from "../accept-modal";
import AppRoutes from "../../shared/routes";
import { logout, mainMenu } from "../../shared/auth-service";
import { TITLES, MESSAGES } from "../../shared/constants";

import { mainItem } from "./interface";

//import { isMobile } from "react-device-detect";
//import { RegisterUsabilityLog } from "../../shared/data-services/ModuleUsabilityLog-service";

const drawerWidth = 240;

const logoStyles = { width: 150 } 

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }: { theme: Theme; open: boolean }) => ({
    flexGrow: 1,
    //padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }: { theme: Theme; open: boolean }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));


const Dashboard: React.FC<{ user: any }> = ({ user }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedIndexMenu, setSelectedIndexMenu] = useState<[number, number]>([0, 0]);
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openProfile = Boolean(anchorEl);
  const [loading, setLoading] = useState(true);
  const [main, setMain] = useState<mainItem[]>([]);

  // construct get menu items
  useEffect(() => {
    async function fetchData() {
      if (loading) {
        try {
          const ids = user.roles.map((role: { id: number; }) => role.id);
          const myMain = await mainMenu(ids);

          if(myMain.length > 0){ setMain(myMain); }

        } catch (error) {
          setLoading(false);
          setMain([]);
        }
      }
    }
    fetchData();
  }, [loading]);


  const handleClickItemOpen = (index: number, subIndex: number, navigateUrl: string, text: string) => {
    if(selectedIndexMenu[0] === index && selectedIndexMenu[1] === subIndex){
      setOpenMenu(false);
      setSelectedIndexMenu([0, 0]);
    }else{
      setSelectedIndexMenu([index, subIndex]);
      setOpenMenu(true);
    }

    if(navigateUrl !== ""){
      //if(isMobile) setOpen(false);
      //RegisterUsabilityLog(text, user.employeeId);
      navigate(navigateUrl);
      // setOpen(false);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  type IconName = keyof typeof IconsMaterial;
  const getIcon = (item: string) => {
    const name: IconName = item as IconName;
  
    const IconComponent = IconsMaterial[name];
    if (!IconComponent) return null;
    return <IconComponent key={item} />;
  };

  const navigate = useNavigate();

  return (
    <>
      {message && <AcceptDialog 
        handleClose= {() => {setMessage("");}}
        dialogContentText ={message}
        dialogTitle={MESSAGES.ALERT}
        handleAccept ={() => logout()}
        open={open}
      />}
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} theme={theme}>
        {user && <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuOpen />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {TITLES.DRAWER}
            </Typography>

            <Tooltip title={user.name + " " + user.lastName}>
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar style={{backgroundColor: "rgb(0, 176, 239)"}}>{user ? `${ user.name[0]}${user.lastName[0]}` : ""}</Avatar>
              </IconButton>
            </Tooltip>

            <Tooltip title="Salir">
              <IconButton aria-label="Example" onClick={() => {
                  setMessage(MESSAGES.CONFIRM_EXIT);
                  setOpen(true);
                }}>
                <ExitToApp style={{color: "white"}}/>
              </IconButton>
            </Tooltip>
          </Toolbar>}
        </AppBar>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <img src={process.env.PUBLIC_URL + "/logo.png"} alt="logo" style={logoStyles} />
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >

          {main.map((item, index) => {
            const { id, text, sort, icon, url, subItems } = item;

            if (subItems.length > 0) {

              return (
                <React.Fragment key={id}>
                  <ListItemButton selected={selectedIndexMenu[0] === index} key={id} onClick={() => handleClickItemOpen(index, sort, url, text)}>
                    <ListItemIcon>
                      {getIcon(icon)}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                    {openMenu && selectedIndexMenu[0] === index ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openMenu && selectedIndexMenu[0] === index} timeout="auto" unmountOnExit>

                    {subItems.map((subItem, subIndex) => {
                      return (
                        <List component="div" disablePadding key={subItem.id}>
                          <ListItemButton
                            selected={selectedIndexMenu[0] === index && selectedIndexMenu[1] === subIndex }
                            sx={{ pl: 4 }}
                            onClick={() => handleClickItemOpen(index, subIndex, subItem.url, subItem.text)}
                          >
                            <ListItemIcon>
                              {getIcon(subItem.icon)}
                            </ListItemIcon>
                            <ListItemText primary={subItem.text} />
                          </ListItemButton>
                        </List>
                      );
                    })}

                  </Collapse>
                </React.Fragment>
              );

            } else {
              return (
                <ListItemButton selected={selectedIndexMenu[0] === index} key={id} onClick={() => handleClickItemOpen(index, sort, url, text)}>
                  <ListItemIcon>
                  {getIcon(icon)}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              );
            }

          })}

          </List>
        </Drawer>

        <Main open={open} theme={theme}>
          <Box mt={8}>
            <AppRoutes user={user} />
          </Box>
        </Main>
      </Box>

      {user && <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openProfile}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <List sx={{ padding: 0 }}>
          <ListItem sx={{ paddingBlock: 0 }}>
            <ListItemText primary={<Typography variant="body2">{user.employeeId}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem sx={{ paddingBlock: 0 }}>
            <ListItemText primary={<Typography variant="body2">{user.name + " " + user.lastName}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem sx={{ paddingBlock: 0 }}>
            <ListItemText primary={<Typography variant="body2">{user.employeePosition}</Typography>} />
          </ListItem>
        </List>
      </Menu>
      }

    </>
  );
}
  
export default Dashboard;