// import { useState } from "react";
// import supabase from "../supabaseClient";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
    
//     if (error) {
//       alert("Login failed: " + error.message);
//     } else {
//       navigate("/data-summarizer"); // Redirect to a protected page
//     }
//   };
//   const handleGoogleLogin = async () => {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo: window.location.origin, // Redirect to homepage after login
//       },
//     });

//     if (error) {
//       console.error("Google login error:", error.message);
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         <button type="submit">Login</button>
//       </form>
//       <div>
//       <h2>Login</h2>
//       <button onClick={handleGoogleLogin}>Sign in with Google</button>
//     </div>
//     </div>
//   );
// };

// export default Login;


import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Card, CardContent, Grid, Divider } from "@mui/material";
import { Google as GoogleIcon, Lock as LockIcon } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        navigate("/dashboard");
      }
    };
    checkUserSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      navigate("/dashboard"); // Redirect to protected page
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`, // Redirect after login
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Card
        sx={{
          mt: 10,
          p: 4,
          textAlign: "center",
          borderRadius: 4,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <CardContent>
          {/* Orato Branding */}
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Orato
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
            <LockIcon fontSize="large" color="primary" /> Login
          </Typography>

          <form onSubmit={handleLogin} style={{ marginTop: 20 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ borderRadius: 2 }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ borderRadius: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: "16px",
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Login
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleGoogleLogin}
            startIcon={<GoogleIcon />}
            sx={{
              py: 1.5,
              fontSize: "16px",
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Sign in with Google
          </Button>

          {/* Sign Up Section */}
          <Typography variant="body2" sx={{ mt: 3 }}>
            Don't have an account?
          </Typography>

          <Button
            variant="text"
            color="secondary"
            fullWidth
            onClick={() => navigate("/signup")}
            sx={{
              mt: 1,
              fontSize: "14px",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Create an Account
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;