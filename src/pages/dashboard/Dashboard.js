// import { useEffect, useState } from "react";
// import supabase from "../supabaseClient";
// import { useNavigate } from "react-router-dom";
// import { Container, Typography, Button, CircularProgress } from "@mui/material";

// const Dashboard = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         navigate("/login");
//         return;
//       }

//       // Fetch user details from "users" table
//       const { data, error } = await supabase.from("users").select("*").eq("email", user.email).single();
//       if (error) {
//         console.error("Error fetching user:", error.message);
//       } else {
//         setUserData(data);
//       }
//       setLoading(false);
//     };

//     fetchUserData();
//   }, [navigate]);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     navigate("/login");
//   };

//   return (
//     <Container maxWidth="sm">
//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <div style={{ textAlign: "center", marginTop: "50px" }}>
//           <Typography variant="h4">Welcome, {userData?.name}!</Typography>
//           <Typography variant="body1">{userData?.email}</Typography>
//           <Button variant="contained" color="secondary" sx={{ mt: 3 }} onClick={handleLogout}>
//             Logout
//           </Button>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default Dashboard;
import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Card, CardContent, Grid, useMediaQuery } from "@mui/material";
import { Menu, Home, Dashboard} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import GrammarCorrectionApp from "../Grammer-correct/GrammerPage";
import DataSummarizer from "../data summarizer/DataSummarizer";
import Calendar from "../calendar/Calendar";
import Writer from "../writer/Writer";
import FileUploadGraph from "../graph-maker/GraphMaker";
import { changeHome } from "../../redux/eventSlice";
import Settings from "../auth/settings";

const renderComponent = (component, dispatch) => {
  const websiteFeatures = ["Data Explainer", "Grammar Corrector", "Calendar Event", "Content Writer", "Graph Maker", "Setting"]
  // const dispatch = useDispatch()
  const handleCardClick = (item) => {
    // alert(`You clicked on the card with item: ${item}`);
    dispatch(changeHome(item))
};
  if (component === "Home") {
    return (
      <Grid container spacing={3} style={{ padding: 20 }}>
        {websiteFeatures.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card onClick={()=>handleCardClick(item)} sx={{ cursor: 'pointer', marginBottom: 2 }}>
            <CardContent>
                <Typography variant="h5">{item}</Typography>
                {/* <Typography variant="body2">Some content here.</Typography> */}
            </CardContent>
        </Card>
          </Grid>
        ))}
      </Grid>
    );
  } else if (component === "Data Explainer") {
    return <DataSummarizer/>;
  } else if (component === "Grammar Corrector") {
    return <GrammarCorrectionApp/>;
  } else if (component === "Calendar Event") {
    return <Calendar/>;
  } else if (component === "Content Writer") {
    return <Writer/>;
  } else if (component === "Graph Maker") {
    return <FileUploadGraph/>;
  } else if (component === "Setting") {
    return <Settings/>;
  } else {
    return <Typography variant="h4">Page Not Found</Typography>;
  }
};


const Dashboardd = () => {
  const component = useSelector((state)=> state.homeState)
  const dispatch = useDispatch()
  // const toggleDrawer = () => {
  //   setOpen(!open);
  // };
  const websiteFeatures = ["Home", "Data Explainer", "Grammer Corrector", "Calendar Event", "Content Writer", "Graph Maker"]

  return (
    <div style={{ display: "flex", width:"100vw" }}>
      <Sidebar/>
      <div style={{ flexGrow: 1 }}>
        <Navbar/>
        {renderComponent(component, dispatch)}
      </div>
    </div>
  );
};

export default Dashboardd;
