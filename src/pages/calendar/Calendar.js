import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import { Button, Dialog, Paper, Typography, Box, useMediaQuery, useTheme } from "@mui/material"
import { addEvent, changeDate } from "../../redux/eventSlice"
import EventForm from "./EventForm"
import EventList from "./EventList"
import { format, isSameMonth, isSameDay } from "date-fns"

export default function Calendar() {
  const events = useSelector((state) => state.events)
  const dispatch = useDispatch()
  const [selectedDate, setSelectedDate] = useState(new Date())
  // const selectedDate = useSelector((state)=>state.date)
  const [openEventForm, setOpenEventForm] = useState(false)
  const [monthEvents, setMonthEvents] = useState([])
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    const filteredEvents = events?.filter((event) => isSameMonth(new Date(event.date), selectedDate))
    setMonthEvents(filteredEvents)
  }, [events, selectedDate])

  const handleDateChange = (date) => {
    setSelectedDate(date)
    // dispatch(changeDate(date))
  }

  const handleAddEvent = () => {
    setOpenEventForm(true)
  }

  const handleCloseEventForm = () => {
    setOpenEventForm(false)
  }

  const handleSaveEvent = (newEvent) => {
    const eventWithId = { ...newEvent, id: Date.now().toString() }
    dispatch(addEvent(eventWithId))
    setOpenEventForm(false)
  }

  const getEventsForDate = (date) => {
    return events?.filter((event) => isSameDay(new Date(event.date), date))
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          margin:!isMobile?"2rem":"1rem"
        }}
      >
        <Paper elevation={3} sx={{ padding: 2, flex: 1 }}>
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            renderDay={(day, _value, DayComponentProps) => {
              const eventsForDay = getEventsForDate(day)
              return (
                <Box
                  key={day.toString()}
                  sx={{
                    position: "relative",
                    height: "40px",
                    width: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DayComponentProps.children {...DayComponentProps} />
                  {eventsForDay.length > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: "2px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        height: "4px",
                        width: "80%",
                        backgroundColor: "primary.main",
                        borderRadius: "2px",
                      }}
                    />
                  )}
                </Box>
              )
            }}
          />
          <Button variant="contained" color="primary" onClick={handleAddEvent} sx={{ mt: 2 }}>
            Add Event
          </Button>
        </Paper>
        <Paper elevation={3} sx={{ padding: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Events for {format(selectedDate, "MMMM d, yyyy")}
          </Typography>
          <EventList events={getEventsForDate(selectedDate)}/>
        </Paper>
      </Box>
      <Paper elevation={3} sx={{ padding: 2, m: 2 }}>
        <Typography variant="h6" gutterBottom>
          All Events for {format(selectedDate, "MMMM yyyy")}
        </Typography>
        <EventList events={monthEvents} />
      </Paper>
      <Dialog open={openEventForm} onClose={handleCloseEventForm}>
        <EventForm onSave={handleSaveEvent} onClose={handleCloseEventForm} initialDate={selectedDate} />
      </Dialog>
    </LocalizationProvider>
  )
}

