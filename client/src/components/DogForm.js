import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Alert
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";

const DogForm = ({ onSuccess }) => {
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/owners", { credentials: "include" })
      .then((r) => r.json())
      .then(setOwners)
      .catch(() => setError("Failed to load owners"));
  }, []);

  return (
    <Formik
      initialValues={{ name: "", breed: "", owner_id: "" }}
      validationSchema={Yup.object({
        name: Yup.string().required("Name is required"),
        breed: Yup.string().required("Breed is required"),
        owner_id: Yup.number().required("Owner is required"),
      })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        const res = await fetch("/dogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        });

        setSubmitting(false);

        if (res.ok) {
          resetForm();
          onSuccess?.();
        } else {
          setError("Failed to add dog");
        }
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
      }) => (
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" mb={2}>
            Add Dog
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            fullWidth
            margin="normal"
            label="Dog Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Breed"
            name="breed"
            value={values.breed}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.breed && Boolean(errors.breed)}
            helperText={touched.breed && errors.breed}
          />

          <TextField
            select
            fullWidth
            margin="normal"
            label="Owner"
            name="owner_id"
            value={values.owner_id}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.owner_id && Boolean(errors.owner_id)}
            helperText={touched.owner_id && errors.owner_id}
          >
            {owners.map((owner) => (
              <MenuItem key={owner.id} value={owner.id}>
                {owner.name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={isSubmitting}
          >
            Add Dog
          </Button>
        </Box>
      )}
    </Formik>
  );
};

export default DogForm;
