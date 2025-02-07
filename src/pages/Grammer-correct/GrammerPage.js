import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Card, CardContent, } from "@mui/material";
function GrammarCorrectionApp() {
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");

  const handleGrammarCorrection = async () => {
    try {
      const response = await axios.post("http://localhost:5000/correct-grammar", {
        text: inputText,
        voiceInput:0,
      });
      setCorrectedText(response.data.corrected_text);
    } catch (error) {
      console.error("Error correcting grammar:", error);
    }
  };

  return (
    <Box maxWidth="sm" sx={{ mt: 3, textAlign: "left", width:"fit", p:3, m:2 }}>
    <Card sx={{ width: "fit", textAlign: "center", padding: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom color="primary">
          Grammar Correction App
        </Typography>
        <TextField
          multiline
          rows={5}
          fullWidth
          variant="outlined"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to correct"
          sx={{ mb: 2 }}
        />
        <Button onClick={handleGrammarCorrection} variant="contained" color="primary" fullWidth>
          Correct Grammar
        </Button>
        {correctedText && (
          <Box mt={3} p={2} bgcolor="grey.100" borderRadius={1}>
            <Typography variant="h6" fontWeight="bold">
              Corrected Text:
            </Typography>
            <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
              {correctedText}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  </Box>
  );
}

export default GrammarCorrectionApp;
