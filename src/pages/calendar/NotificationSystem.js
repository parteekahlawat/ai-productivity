import React, { useEffect, useState } from "react"
import { Snackbar, Alert } from "@mui/material"

export default function NotificationSystem({ events }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const checkUpcomingEvents = () => {
      const now = new Date()
      const upcomingEvents = events?.filter((event) => {
        const timeDiff = new Date(event.date).getTime() - now.getTime()
        const daysDiff = timeDiff / (1000 * 3600 * 24)
        return daysDiff > 0 && daysDiff <= 3
      })

      if (upcomingEvents?.length > 0) {
        setMessage(`You have ${upcomingEvents.length} upcoming event(s) in the next 3 days!`)
        setOpen(true)
      }
    }

    checkUpcomingEvents()
    const intervalId = setInterval(checkUpcomingEvents, 60000) // Check every minute

    return () => clearInterval(intervalId)
  }, [events])

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

