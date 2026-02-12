import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Stack
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";

const SERVICES = [
  "Bath",
  "Haircut",
  "Nail Trim",
  "Full Groom",
];

const AppointmentForm = ({ onSubmit }) => {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    fetch("/dogs", { credentials: "include" })
      .then(r => r.json())
      .then(setDogs);
  }, []);

  return (
    <Formik
      initialValues={{
        date: "",
        service: "",
        note: "",
        dog_id: "",
      }}
      validationSchema={Yup.object({
        date: Yup.string().required("Date is required"),
        service: Yup.string().required("Service is required"),
        dog_id: Yup.number().required("Dog is required"),
      })}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>

            {/* Date */}
            <TextField
              type="date"
              name="date"
              label="Appointment Date"
              InputLabelProps={{ shrink: true }}
              value={values.date}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.date && Boolean(errors.date)}
              helperText={touched.date && errors.date}
            />

            {/* Service */}
            <TextField
              select
              name="service"
              label="Service"
              value={values.service}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.service && Boolean(errors.service)}
              helperText={touched.service && errors.service}
            >
              {SERVICES.map(service => (
                <MenuItem key={service} value={service}>
                  {service}
                </MenuItem>
              ))}
            </TextField>

            {/* Dog */}
            <TextField
              select
              name="dog_id"
              label="Dog"
              value={values.dog_id}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.dog_id && Boolean(errors.dog_id)}
              helperText={touched.dog_id && errors.dog_id}
            >
              {dogs.map(dog => (
                <MenuItem key={dog.id} value={dog.id}>
                  {dog.name} ({dog.owner?.name})
                </MenuItem>
              ))}
            </TextField>

            {/* Note */}
            <TextField
              multiline
              rows={3}
              name="note"
              label="Notes (optional)"
              value={values.note}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              Add Appointment
            </Button>

          </Stack>
        </form>
      )}
    </Formik>
  );
};

export default AppointmentForm;
