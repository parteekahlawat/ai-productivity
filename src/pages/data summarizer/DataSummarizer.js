import React, { useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, Typography, CircularProgress, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Container } from "@mui/material";

import supabase from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const DataSummarizer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState("");
  const [choice, setChoice] = useState("summary");
  const [query, setQuery] = useState("");
  const backendLink = process.env.REACT_APP_BACKEND_LINK
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleChoiceChange = (event) => {
    setChoice(event.target.value);
  };
  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }
    setLoading(true);
    setError(null);
    setResponseData("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("choice", choice);
    if (choice === "query") {
      formData.append("query", query);
    }

    try {
      const response = await axios.post(`${backendLink}/data-summarizer`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponseData(response.data.content);
    } catch (error) {
      setError("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 3, }}>
      <Card sx={{ width: "auto", textAlign: "center", padding: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Add File
          </Typography>
          <TextField
            type="file"
            onChange={handleFileChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <FormControl component="fieldset" sx={{ marginTop: 2 }}>
            <RadioGroup row value={choice} onChange={handleChoiceChange}>
              <FormControlLabel value="summary" control={<Radio />} label="Summarize" />
              <FormControlLabel value="query" control={<Radio />} label="Ask a Query" />
            </RadioGroup>
          </FormControl>
          {choice === "query" && (
            <TextField
              label="Enter your query"
              fullWidth
              variant="outlined"
              margin="normal"
              value={query}
              onChange={handleQueryChange}
            />
          )}
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Upload File"}
          </Button>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </CardContent>
      </Card>
      {responseData && (
        <Card sx={{ marginTop: 3, padding: 2, width:"100%" }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">
              Your Answer:
            </Typography>
            <Typography variant="body2" sx={{ overflowY: "auto", padding: 1, backgroundColor: "#e0e0e0", borderRadius: 1, maxHeight:"100vh" }}>
              {responseData}
            </Typography>
          </CardContent>
        </Card>
      )}
      {/* <Button onClick={handleLogout} variant="outlined" color="secondary" sx={{ mt: 3 }}>
        Logout
      </Button> */}
    </Container>
  );
};

export default DataSummarizer;
