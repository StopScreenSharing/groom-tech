import React from "react";
import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppointmentForm from "../AppointmentForm";

const AddAppointment = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    const res = await fetch("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    });

    setSubmitting(false);

    if (res.ok) {
      navigate("/");
    }
  };

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 400 }}>

        <Button
          variant="outlined"
          onClick={() => navigate("/")}
        >
          View Appointments
        </Button>

        <AppointmentForm onSubmit={handleSubmit} />

      </Stack>
    </Box>
  );
};

export default AddAppointment;
