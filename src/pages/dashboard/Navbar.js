import { Menu, Logout } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Menu as MenuUI,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSidebar } from "../../redux/eventSlice";
import supabase from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const open = useSelector((state) => state.sidebarState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDrawer = () => {
    dispatch(changeSidebar(!open));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main", boxShadow: 3 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Left Side - Logo & Menu Button */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 1 }}>
              <Menu />
            </IconButton>
          )}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ ml: isMobile ? 1 : 2, color: "white", cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            ORATO
          </Typography>
          <Typography
            variant="body2"
            sx={{ ml: 1, color: "white", opacity: 0.8, mt:0.5 }}
          >
            - Increase Your Productivity
          </Typography>
        </Box>

        {/* Right Side - Logout Button */}
        {!isMobile ? (
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="secondary"
            sx={{
              borderColor: "white",
              color: "white",
              "&:hover": { borderColor: "secondary.main" },
            }}
            startIcon={<Logout />}
          >
            Logout
          </Button>
        ) : (
          <>
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Logout />
            </IconButton>
            <MenuUI
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuUI>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
