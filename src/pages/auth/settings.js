import { useState, useEffect } from "react";
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
  Box,
} from "@mui/material";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchUserDetails = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        setMessage({ type: "error", text: "Failed to fetch user details." });
      } else {
        setUser(user);
        setUsername(user.user_metadata?.username || "");
        setEmail(user.email);
      }
    };

    fetchUserDetails();
  }, []);

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    const updates = {
      data: { username },
    };

    const { error } = await supabase.auth.updateUser(updates);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }

    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      setMessage({ type: "error", text: "Please enter a new password." });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Password updated successfully!" });
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 5, p: 4, textAlign: "center", borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Settings
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Manage your account details
          </Typography>

          {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

          {/* Username */}
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Email (Read-only) */}
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            value={email}
            disabled
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update Profile"}
          </Button>

          {/* Password Section */}
          <Typography variant="h6" sx={{ mt: 4 }}>
            Change Password
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            label="New Password"
            type="password"
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleChangePassword}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update Password"}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Settings;
