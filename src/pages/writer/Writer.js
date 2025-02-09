import React, { useState } from "react";
import { AppBar, Toolbar, Typography, RadioGroup, FormControlLabel, Radio, Button, TextField, Card, CardContent, FormControl, Box,} from "@mui/material";
import axios from "axios";


const Writer = () => {
  const [promptType, setPromptType] = useState("email");
  const [customPrompt, setCustomPrompt] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [response, setResponse] = useState("");
  const backendLink = process.env.REACT_APP_BACKEND_LINK
  const handlePromptChange = (event) => {
    setPromptType(event.target.value);
    setShowCustomInput(event.target.value === "custom");
  };

  const handleGenerateContent = async () => {
    const selectedPrompt = showCustomInput ? customPrompt : promptType;
    try {
      const res = await axios.post(`${backendLink}/generate-content`, {
        promptType: selectedPrompt,
        additional: additionalDetails,
        voiceInput:0,
      });
    //   setResponse(res.data.generatedContent);
    setResponse(res.data.generatedContent.replace(/\n/g, "<br>"));
    } catch (error) {
      setResponse("Error generating content. Please try again.");
    }
  };

  return (
    <>
      <Box maxWidth="md" sx={{ mt: 3, textAlign: "left", width:"fit"}}>
        <Card sx={{ width: "fit", padding: 1, m:2 }}>
          <CardContent sx={{border:"none" }}>
            <Typography variant="h5" gutterBottom>
              Select Prompt Type
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup row value={promptType} onChange={handlePromptChange}>
                <Box display="flex" justifyContent="center" gap={2}>
                  <FormControlLabel value="email" control={<Radio />} label="Email" />
                  <FormControlLabel value="speech" control={<Radio />} label="Speech" />
                  <FormControlLabel value="lecture" control={<Radio />} label="Lecture" />
                  <FormControlLabel value="custom" control={<Radio />} label="Custom" />
                </Box>
              </RadioGroup>
            </FormControl>
            {showCustomInput && (
              <TextField
                label="Enter Custom Prompt"
                fullWidth
                variant="outlined"
                margin="normal"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            )}
            <TextField
              label="Additional Details"
              fullWidth
              variant="outlined"
              margin="normal"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleGenerateContent}>
              Generate Content
            </Button>
          </CardContent>
        </Card>
        {response && (
          <Card sx={{ width: "fit", maxWidth: "md", margin: "auto", m: 2, padding: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">Content for {promptType}:</Typography>
              {/* <Typography variant="body1" sx={{ wordWrap: "break-word", mt: 2 }}>{response}</Typography> */}
              <Typography
                variant="body1"
                sx={{ wordWrap: "break-word", mt: 2 }}
                dangerouslySetInnerHTML={{ __html: response }} // Renders formatted text
              />
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
};

export default Writer;
