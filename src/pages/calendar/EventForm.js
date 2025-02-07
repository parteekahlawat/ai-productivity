import React, { useState } from "react"
import { TextField, Button, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme } from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

export default function EventForm({ onSave, onClose, initialDate }) {
  const [date, setDate] = useState(initialDate || new Date())
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleSave = () => {
    if (date && title) {
      onSave({ date, title, description })
      setDate(new Date())
      setTitle("")
      setDescription("")
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DialogTitle>Add New Event</DialogTitle>
      <DialogContent>
        <DateTimePicker
          label="Event Date and Time"
          value={date}
          onChange={(newDate) => setDate(newDate)}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Event Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Event Description"
          type="text"
          fullWidth
          multiline
          rows={isMobile ? 2 : 4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </LocalizationProvider>
  )
}

