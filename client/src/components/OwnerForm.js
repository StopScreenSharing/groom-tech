import React from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Alert
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";

const OwnerForm = ({ onSubmit, successMessage }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400 }}>
      <Typography variant="h6" mb={2}>
        Add New Owner
      </Typography>

      <Formik
        initialValues={{ name: "", phone_number: "" }}
        validationSchema={Yup.object({
          name: Yup.string().required("Name is required"),
          phone_number: Yup.string()
            .matches(/^\d{10}$/, "Must be 10 digits")
            .required("Phone number is required"),
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
            <TextField
              fullWidth
              label="Owner Name"
              name="name"
              margin="normal"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              margin="normal"
              value={values.phone_number}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone_number && Boolean(errors.phone_number)}
              helperText={touched.phone_number && errors.phone_number}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isSubmitting}
            >
              Add Owner
            </Button>

            {successMessage && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {successMessage} was successfully added
              </Alert>
            )}
          </form>
        )}
      </Formik>
    </Paper>
  );
};

export default OwnerForm;
