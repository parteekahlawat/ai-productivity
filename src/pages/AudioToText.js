import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addEvent } from "../redux/eventSlice";
import { AppBar, IconButton, Toolbar, Typography, useMediaQuery, useTheme, Box, Button, Card, CardContent, CircularProgress } from "@mui/material";
import { Menu, Mic, MicOff, CloudUpload } from "@mui/icons-material";


const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const dispatch = useDispatch();
  const open = useSelector((state) => state.sidebarState);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const backendLink = process.env.REACT_APP_BACKEND_LINK
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };


  const addEvent = async (response)=>{
    const eventDetails = await axios.post(`${backendLink}/add-event`,
      { text: response.data.response }, 
      {
        headers: {
          "Content-Type": "application/json", 
        },
      }
    );
    console.log(eventDetails.data)
    if (eventDetails.statusText==="OK") {
      dispatch(addEvent(eventDetails.data)); // Add extracted event to Redux
      alert("Event added Successfully!")
    }
    setLoading(false)
  }


  const uploadAudio = async () => {
    if (!audioBlob) {
      alert("No audio recorded!");
      return;
    }
    setLoading(true)
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");

    try {
      const response = await axios.post(`${backendLink}/process-audio`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // ✅ Correct Content-Type for FormData
        }
      })

      console.log("Upload successful:", response.data);
      setResponseText(response.data.response || "No response from server");
      console.log(response.data.response.toLowerCase().includes("add an event"))

      if (response.data.response.toLowerCase().includes("add an event") || response.data.response.toLowerCase().includes("add an another event")) {
        console.log("Detected event addition. Calling Gemini API...");
        addEvent(response)
      };

      if (response.data.response.toLowerCase().includes("check the grammar") || response.data.response.toLowerCase().includes("check my grammar") || response.data.response.toLowerCase().includes("grammar check")) {
        console.log("Detected grammar check. Calling Gemini API...");
        // addEvent(response)
        setLoading(false)
      };
      setLoading(false)
    } catch (error) {
      console.error("Upload failed:", error);
      setResponseText("Error processing audio");
    }
  };


  return (
    // <div className="p-4 flex flex-col items-center gap-4">
    //   <h2 className="text-lg font-bold">Audio Recorder</h2>
    //   <button
    //     onClick={recording ? stopRecording : startRecording}
    //     className={`px-4 py-2 rounded ${recording ? "bg-red-500" : "bg-green-500"} text-white`}
    //   >
    //     {recording ? "Stop Recording" : "Start Recording"}
    //   </button>
    //   {audioBlob && (
    //     <div className="flex flex-col items-center">
    //       <audio controls src={URL.createObjectURL(audioBlob)} className="mt-2" />
    //       <button onClick={uploadAudio} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
    //         Upload Audio & Process
    //       </button>
    //     </div>
    //   )}
    //   {responseText && (
    //     <div className="mt-4 p-2 border rounded bg-gray-100">
    //       <strong>Response:</strong> {responseText}
    //     </div>
    //   )}
    // </div>
    <Card sx={{ p: 2, textAlign: "center", mt: isMobile ? 2 : 0 }}>
      {
        !open ? <>{recording ? <MicOff onClick={stopRecording} color={"error"} sx={{ cursor: "pointer" }} /> : <Mic onClick={startRecording} color={"success"} sx={{ cursor: "pointer" }} />}{audioBlob && (
          loading ? <CircularProgress size={24} color="inherit" /> : <CloudUpload onClick={uploadAudio} color="primary" sx={{ mt: 2 }} />

        )}</> : <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Give task
          </Typography>
          <Button
            variant="contained"
            color={recording ? "error" : "success"}
            startIcon={recording ? <MicOff /> : <Mic />}
            onClick={recording ? stopRecording : startRecording}
            sx={{ mb: 2, width: "100%" }}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </Button>
          {audioBlob && (
            <Box mt={2}>
              <audio controls src={URL.createObjectURL(audioBlob)} style={{ width: "100%" }} />
              <Button
                variant="contained"
                color="primary"
                startIcon={<CloudUpload />}
                onClick={uploadAudio}
                sx={{ mt: 2, width: "100%" }}
              >
                Upload Audio & Process
              </Button>
            </Box>
          )}
          {/* {responseText && (
          <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
            <Typography variant="body1" fontWeight="bold">
              Response:
            </Typography>
            <Typography variant="body2">{responseText}</Typography>
          </Box>
        )} */}
        </CardContent>
      }

    </Card>
  );
};

export default AudioRecorder;