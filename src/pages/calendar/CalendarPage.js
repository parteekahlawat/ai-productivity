import React, { useState, useEffect } from "react"
import { CssBaseline, Container, Typography } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import Calendar from "./Calendar"
import NotificationSystem from "./NotificationSystem"
import { useDispatch, useSelector } from "react-redux"
import { addEvent, setEvents } from "../../redux/eventSlice"; 
// import AudioRecorder from "./AudioToText"

const theme = createTheme()

function CalendarPage() {
const dispatch = useDispatch();
const events = useSelector((state) => state.events);
console.log("events - ", events)
//   useEffect(() => {
//     const storedEvents = localStorage.getItem("events") || []
//     if (storedEvents) {
//     //   setEvents(
//     //     JSON.parse(storedEvents).map((event) => ({
//     //       ...event,
//     //       date: new Date(event.date),
//     //     })),
//     //   )
//         dispatch(setEvents(
//           events?.map((event) => ({
//             ...event,
//             date: new Date(event.date), 
//           }))
//         ))
//     }
//     else {
//         console.log("See ittttt")
//       }
//   }, [])

  useEffect(() => {
    if (events?.length > 0) {
        localStorage.setItem("events", events);
      }
  }, [events])

  const handleSaveEvent = (newEvent) => {
    const eventWithId = { ...newEvent, id: Date.now().toString() }
    // setEvents([...events, eventWithId])
    dispatch(addEvent(eventWithId));
  }
const eve = [
  {
    "id": "1",
    "title": "Team Meeting",
    "description": "Weekly team sync-up",
    "date": "2025-02-01T10:00:00.000Z"
  },
  {
    "id": "2",
    "title": "Project Deadline",
    "description": "Submit final project report",
    "date": "2025-02-15T17:00:00.000Z"
  },
  {
    "id": "3",
    "title": "Birthday Party",
    "description": "Celebrate office birthdays",
    "date": "2025-02-28T12:00:00.000Z"
  }
]
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" gutterBottom style={{ textAlign: "center", margin: "20px 0" }}>
          Event Calendar
        </Typography>
        <Calendar />
        <NotificationSystem events={events} />
      </Container>
    </ThemeProvider>
  )
}

export default CalendarPage;


