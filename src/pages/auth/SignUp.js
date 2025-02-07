import { useState } from "react";
import supabase from "../../supabaseClient";
import { Container, TextField, Button, Typography, Card, CardContent, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
    // if (!user) {
    //     // navigate("/login");
    //     alert("singed up already")
    //     navigate("/login");
    //     return;
    //   }

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    console.log("Supabase Response:", user, error);
  if (!user) {
    setError("Signup successful, but verification is required. Please check your email.");
    setLoading(false);
    return;
  }
    // Step 2: Store user details in Supabase "users" table
    const { data, error: dbError } = await supabase.from("users").insert([
      { id: user.id, email, name },
    ]);

    if (dbError) {
      setError(dbError.message);
    } else {
      setSuccess("User registered successfully!");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="xs">
      <Card sx={{ mt: 5, p: 3, textAlign: "center", borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>Sign Up</Typography>

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
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Signup;
