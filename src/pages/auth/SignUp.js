import { useState } from "react";
import supabase from "../../supabaseClient";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Google as GoogleIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Step 1: Create user with metadata (username)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      setLoading(false);
      return;
    }

    if (!data.user) {
      setMessage({
        type: "success",
        text: "Signup successful! Please check your email to verify your account.",
      });
      setLoading(false);
      return;
    }

    // Step 2: Store user details in Supabase "users" table
    const { error: dbError } = await supabase.from("users").insert([
      { id: data.user.id, email, username },
    ]);

    if (dbError) {
      setMessage({ type: "error", text: dbError.message });
    } else {
      setMessage({
        type: "success",
        text: "Signup successful! Please check your email to verify your account.",
      });

      setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 5, p: 4, textAlign: "center", borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          {/* ORATO Branding */}
          <Typography variant="h4" fontWeight="bold" color="primary">
            Orato
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              mt: 1,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <PersonAddIcon fontSize="large" color="primary" /> Sign Up
          </Typography>

          {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

          <form onSubmit={handleSignup}>
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

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
              sx={{ mt: 2, py: 1.5, fontSize: "16px", borderRadius: 2, textTransform: "none" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<GoogleIcon />}
            sx={{ py: 1.5, fontSize: "16px", borderRadius: 2, textTransform: "none" }}
            disabled={loading}
          >
            Sign Up with Google
          </Button>

          <Typography variant="body2" sx={{ mt: 3 }}>
            Already have an account?
          </Typography>

          <Button
            variant="text"
            color="secondary"
            fullWidth
            onClick={() => navigate("/login")}
            sx={{ mt: 1, fontSize: "14px", textTransform: "none", fontWeight: "bold" }}
          >
            Login Instead
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Signup;
