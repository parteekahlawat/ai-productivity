import { useState } from "react";
import supabase from "../../supabaseClient";
import { 
  Container, TextField, Button, Typography, Card, 
  CardContent, Alert, CircularProgress, Divider 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Google as GoogleIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Step 1: Create user in Supabase Auth
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!user) {
      setError("Signup successful! Please check your email to verify your account.");
      setLoading(false);
      return;
    }

    // Step 2: Store user details in Supabase "users" table
    const { error: dbError } = await supabase.from("users").insert([
      { id: user.id, email, name },
    ]);

    if (dbError) {
      setError(dbError.message);
    } else {
      setSuccess("Signup successful! Please check your email to verify your account.");
      setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });

    if (error) {
      setError("Google signup failed: " + error.message);
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
          <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1, mb: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
            <PersonAddIcon fontSize="large" color="primary" /> Sign Up
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSignup}>
            <TextField
              fullWidth margin="normal" label="Full Name" variant="outlined"
              value={name} onChange={(e) => setName(e.target.value)} required
            />
            <TextField
              fullWidth margin="normal" label="Email" type="email" variant="outlined"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
            <TextField
              fullWidth margin="normal" label="Password" type="password" variant="outlined"
              value={password} onChange={(e) => setPassword(e.target.value)} required
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
            onClick={handleGoogleSignup}
            startIcon={<GoogleIcon />}
            sx={{ py: 1.5, fontSize: "16px", borderRadius: 2, textTransform: "none" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up with Google"}
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
