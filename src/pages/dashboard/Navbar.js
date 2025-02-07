import { Menu } from "@mui/icons-material";
import { AppBar, Box, Button, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSidebar } from "../../redux/eventSlice";
import AudioRecorder from "../AudioToText";
import supabase from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const open = useSelector((state) => state.sidebarState);
    const dispatch = useDispatch();
    
    const navigate = useNavigate();
    const toggleDrawer = () => {
        // setOpen(!open);
        dispatch(changeSidebar(!open));
    };
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
      };
    return (
        <AppBar position="static">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {isMobile && (
                        <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                            <Menu />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ ml: isMobile ? 1 : 2 }}>AI Productivity</Typography>
                </Box>
                {/* <AudioRecorder /> */}
                <Button onClick={handleLogout} variant="outlined" color="secondary" sx={{ m: 2, color:"white", borderColor:"white" }}>
        Logout
      </Button>
            </Toolbar>
        </AppBar>
    )
};
export default Navbar;