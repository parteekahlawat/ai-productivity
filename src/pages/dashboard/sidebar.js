import { Dashboard, Home, Settings, Menu } from "@mui/icons-material";
import { CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
// import { Menu } from "@mui/icons-material"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeHome, changeSidebar } from "../../redux/eventSlice";
import AudioRecorder from "../AudioToText";

const Sidebar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const open = useSelector((state) => state.sidebarState);
    const component = useSelector((state) => state.homeState);
    const dispatch = useDispatch();

    const websiteFeatures = ["Home", "Data Explainer", "Grammar Corrector", "Calendar Event", "Content Writer", "Graph Maker"]

    const toggleDrawer = () => {
        dispatch(changeSidebar(!open));
    };
    const handleComponentChange = (text) => {
        dispatch(changeHome(text))
    }
    return (
        <>
            <CssBaseline />
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={open}
                onClose={toggleDrawer}
                sx={{
                    // width: open ? 240 : isMobile ? 0 : 60,
                    // flexShrink: 0,
                    // "& .MuiDrawer-paper": {
                    //     width: open ? 240 : isMobile ? 0 : 60,
                    //     transition: "width 0.3s",
                    //     overflowX: "hidden",
                    // },
                    width: open ? 240 : isMobile ? 0 : 60,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: open ? 240 : isMobile ? 0 : 60,
                        transition: "width 0.3s",
                        overflowX: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100vh",
                    },
                }}
            >
                <List>
                    <ListItem button onClick={toggleDrawer} sx={{ cursor: "pointer" }}>
                        <ListItemIcon>
                            <Menu />
                        </ListItemIcon>
                    </ListItem>
                    {websiteFeatures.map((text, index) => (
                        <ListItem button key={text} onClick={() => handleComponentChange(text)} sx={{ cursor: "pointer" }}>
                            <ListItemIcon>
                                {index === 0 ? <Home /> : <Dashboard />}
                            </ListItemIcon>
                            {open && <ListItemText primary={text} />}
                        </ListItem>
                    ))}
                </List>
                <AudioRecorder />
            </Drawer>

        </>
    )
};

export default Sidebar;