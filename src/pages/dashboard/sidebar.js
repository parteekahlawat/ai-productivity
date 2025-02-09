import { Dashboard, Home, Settings, Menu } from "@mui/icons-material";
import {
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider,
  Typography,
  IconButton,
  Box,
  Tooltip
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { changeHome, changeSidebar } from "../../redux/eventSlice";
import AudioRecorder from "../AudioToText";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const open = useSelector((state) => state.sidebarState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const websiteFeatures = [
    { name: "Home", icon: <Home /> },
    { name: "Data Explainer", icon: <Dashboard /> },
    { name: "Grammar Corrector", icon: <Dashboard /> },
    { name: "Calendar Event", icon: <Dashboard /> },
    { name: "Content Writer", icon: <Dashboard /> },
    { name: "Graph Maker", icon: <Dashboard /> },
  ];

  const toggleDrawer = () => {
    dispatch(changeSidebar(!open));
  };

  const handleComponentChange = (text) => {
    dispatch(changeHome(text));
  };

  return (
    <>
      <CssBaseline />
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: open ? 240 : isMobile ? 0 : 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 240 : isMobile ? 0 : 80,
            transition: "width 0.3s",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100vh",
            backgroundColor: theme.palette.background.default,
            boxShadow: 3,
          },
        }}
      >
        {/* Sidebar Header */}
        <Box sx={{ display: "flex", alignItems: "center", p: 2, justifyContent: open ? "space-between" : "center" }}>
          {open && (
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
              ORATO
            </Typography>
          )}
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <Menu />
          </IconButton>
        </Box>

        <Divider />

        {/* Sidebar Menu Items */}
        <List sx={{ flexGrow: 1 }}>
          {websiteFeatures.map(({ name, icon }, index) => (
            <Tooltip title={open ? "" : name} key={name} placement="right">
              <ListItem
                button
                onClick={() => handleComponentChange(name)}
                sx={{
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": { backgroundColor: theme.palette.action.hover },
                  padding: open ? "10px 16px" : "10px",
                  justifyContent: open ? "flex-start" : "center",
                }}
              >
                <ListItemIcon sx={{ color: "primary.main", minWidth: "unset", mr: open ? 2 : 0 }}>
                  {icon}
                </ListItemIcon>
                {open && <ListItemText primary={name} />}
              </ListItem>
            </Tooltip>
          ))}
        </List>

        <Divider />

        {/* Bottom Section - Audio Recorder & Settings */}
        <Box sx={{ p: 2 }}>
          <AudioRecorder />
          <Tooltip title="Settings" placement="right">
            <ListItem button sx={{ justifyContent: open ? "flex-start" : "center" }} onClick={()=>handleComponentChange("Setting")}>
              <ListItemIcon sx={{ color: "primary.main" }}>
                <Settings />
              </ListItemIcon>
              {open && <ListItemText primary="Settings" />}
            </ListItem>
          </Tooltip>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
