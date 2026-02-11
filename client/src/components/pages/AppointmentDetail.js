import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    service: "",
    note: "",
  });

  useEffect(() => {
    fetch(`/appointments/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setAppointment(data);
        setFormData({
          date: data.date,
          service: data.service,
          note: data.note || "",
        });
        setLoading(false);
      })
      .catch(() => navigate("/", { replace: true }));
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    fetch(`/appointments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((r) => r.json())
      .then((updated) => {
        setAppointment(updated);
        setEditing(false);
      });
  };

  const handleDelete = () => {
    fetch(`/appointments/${id}`, {
      method: "DELETE",
    }).then(() => navigate("/"));
  };

  if (loading) {
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={2}>
          Appointment Details
        </Typography>

        <Stack spacing={2}>
          <Typography>
            <strong>Dog:</strong> {appointment.dog.name}
          </Typography>

          <Typography>
            <strong>Owner:</strong> {appointment.dog.owner.name}
          </Typography>

          {editing ? (
            <>
              <TextField
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Service"
                name="service"
                value={formData.service}
                onChange={handleChange}
              />

              <TextField
                label="Note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                multiline
                rows={3}
              />

              <Button variant="contained" onClick={handleUpdate}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Typography>
                <strong>Date:</strong>{" "}
                {new Date(appointment.date).toLocaleDateString()}
              </Typography>

              <Typography>
                <strong>Service:</strong> {appointment.service}
              </Typography>

              {appointment.note && (
                <Typography>
                  <strong>Note:</strong> {appointment.note}
                </Typography>
              )}

              <Button
                variant="outlined"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            </>
          )}

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
          >
            Delete Appointment
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AppointmentDetail;
