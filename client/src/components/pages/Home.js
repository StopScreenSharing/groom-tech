import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    CircularProgress
} from "@mui/material";

import AppointmentCard from "../AppointmentCard";

const Home = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/appointments")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch appointments");
        return r.json();
      })
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Upcoming Appointments
      </Typography>

      {appointments.length === 0 ? (
        <Typography>No upcoming appointments</Typography>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appointment) => (
            <Grid item xs={12} md={6} lg={4} key={appointment.id}>
              <AppointmentCard appointment={appointment} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Home;