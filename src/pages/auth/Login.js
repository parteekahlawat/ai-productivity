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


import { useState } from "react";
import supabase from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Card, CardContent, Grid } from "@mui/material";
import { Google as GoogleIcon, Lock as LockIcon } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
    <Container maxWidth="sm">
      <Card sx={{ mt: 10, p: 4, textAlign: "center", borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            <LockIcon fontSize="large" color="primary" /> Login
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.5, fontSize: "16px" }}
            >
              Login
            </Button>
          </form>

          <Typography variant="body1" sx={{ mt: 3, mb: 2 }}>
            OR
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleGoogleLogin}
            startIcon={<GoogleIcon />}
            sx={{ py: 1.5, fontSize: "16px" }}
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
