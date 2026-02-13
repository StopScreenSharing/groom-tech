import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  CircularProgress,
  MenuItem,
  Alert
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";

const SERVICES = [
  "Bath",
  "Nails",
  "Brush",
  "Full Groom",
];


const AppointmentSchema = Yup.object({
  date: Yup.date()
    .min(
      new Date().toISOString().split("T")[0],
      "Date cannot be in the past"
    )
    .required("Date is required"),
  service: Yup.string().required("Service is required"),
  note: Yup.string(),
});

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setGroomer } = useContext(AppContext);

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch(`/appointments/${id}`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setAppointment(data);
        setLoading(false);
      })
      .catch(() => navigate("/", { replace: true }));
  }, [id, navigate]);

  const handleDelete = () => {
    fetch(`/appointments/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");

        setGroomer((prevGroomer) => {
          const dogs = prevGroomer.dogs || [];
          const dogId = appointment.dog?.id;

          const updatedDogs = dogs
            .map((dog) => {
              if (dog.id !== dogId) return dog;

              const remainingAppointments = dog.appointments.filter(
                (apt) => apt.id != id
              );

              if (remainingAppointments.length === 0) {
                return null;
              }
              return { ...dog, appointments: remainingAppointments };
            })
            .filter((dog) => dog !== null);

          return { ...prevGroomer, dogs: updatedDogs };
        });

        navigate("/");
      })
      .catch(() => alert("Could not delete appointment"));
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
            <Formik
              initialValues={{
                date: appointment.date,
                service: appointment.service,
                note: appointment.note || "",
              }}
              validationSchema={AppointmentSchema}
              onSubmit={(values, { setSubmitting, setStatus }) => {
                setStatus(null);

                fetch(`/appointments/${id}`, {
                  method: "PATCH",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify(values),
                })
                  .then(async (r) => {
                    const data = await r.json();

                    if (!r.ok) {
                      throw new Error(data.error || "Update failed");
                    }

                    setAppointment(data);

                    setGroomer((prevGroomer) => {
                      const dogs = prevGroomer.dogs || [];
                      const dogId = data.dog?.id;

                      const updatedDogs = dogs.map((dog) => {
                        if (dog.id !== dogId) return dog;

                        const updatedAppointments = dog.appointments.map((apt) =>
                          apt.id == id
                            ? {
                                id: data.id,
                                date: data.date,
                                service: data.service,
                                note: data.note,
                              }
                            : apt
                        );
                        return { ...dog, appointments: updatedAppointments };
                      });

                      return { ...prevGroomer, dogs: updatedDogs };
                    });

                    setEditing(false);
                  })
                  .catch((err) => {
                    setStatus(err.message);
                  })
                  .finally(() => setSubmitting(false));
                }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                status
              }) => (
                <form onSubmit={handleSubmit}>
                  <Stack spacing={2}>

                    {status && (
                      <Alert severity="error">
                        {status}
                      </Alert>
                    )}
                    <TextField
                      label="Date"
                      type="date"
                      name="date"
                      value={values.date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        min: new Date().toISOString().split("T")[0],
                      }}
                      error={touched.date && Boolean(errors.date)}
                      helperText={touched.date && errors.date}
                    />

                    <TextField
                      select
                      label="Service"
                      name="service"
                      value={values.service}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.service && Boolean(errors.service)}
                      helperText={touched.service && errors.service}
                    >
                      {SERVICES.map((service) => (
                        <MenuItem key={service} value={service}>
                          {service}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Note"
                      name="note"
                      value={values.note}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      multiline
                      rows={3}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                    >
                      Save Changes
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </form>
              )}
            </Formik>
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

