import React, { useEffect, useState } from "react"
import { List, ListItem, ListItemText, Typography, useMediaQuery, useTheme } from "@mui/material"
import { format, isSameDay, parseISO, subHours, subMinutes } from "date-fns"
import { useSelector } from "react-redux"
// import { utcToZonedTime } from "date-fns-tz"; 
export default function EventList({events}) {
  // const events = useSelector((state) => state.events)
  // const selectedDate = useSelector((state)=>state.date)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
console.log("Event list -", events)
  return (
    <List sx={{ maxHeight: isMobile ? "200px" : "300px", overflowY: "auto" }}>
      {events?.length === 0 ? (
        <Typography>No events scheduled.</Typography>
      ) : (
        events?.map((event) => (
          <ListItem key={event.id}>
            <ListItemText
              primary={event.title}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {/* {format((new Date(event?.date)), "MMM d, yyyy h:mm a")} */}
                    {/* {format(new Date((event?.date)), "hh:mm a")} */}
                    {format(subMinutes(subHours(new Date(event?.date), 5), 30), "MMM d, yyyy h:mm a")}
                  </Typography>
                  {isMobile ? null : ` — ${event.description}`}
                </>
              }
            />
          </ListItem>
        ))
      )}
    </List>
  )
}

