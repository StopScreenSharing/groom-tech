import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppConetxt } from "../context/AppContext";

import {
    Box,
    Button,
    TextField,
    Typography,
    Paper
} from "@mui/material";

import { Formik, formik, validateYupSchema } from "formik";
import * as Yup from "yup";

const Signup = () => {
    const { signup } = useContext(AppConetxt);
    const navigate = useNavigate();

    return (
        <Box
        sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
        >
            <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
                <Typography variant="h5" mb={2} align="center">
                    Groomer Signup
                </Typography>

                <Formik
                    initialValues={{
                        name: "",
                        employee_number: "",
                        phone_number: "",
                        password: "",
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string().required("Name is required"),
                        employee_number: Yup.string().length(4, "Must be exactly 4 digits").required("Employee number is required"),
                        phone_number: Yup.string().length(10, "Must be 10 digits").required("Phone number is required"),
                        password: Yup.string().min(6, "Must be atleast 6 characters").required("Password is required"),
                    })}
                    onSubmit={async (values, { setSubmitting, setErrors }) => {
                        const result = await signup(
                            values.name,
                            values.employee_number,
                            values.phone_number,
                            values.password
                        );

                        setSubmitting(false);

                        if (result === true) {
                            navigate("/main");
                        } else {
                            setErrors({ password: result.error || "Signup failed" });
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
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Name"
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
                                    label="Employee Number"
                                    name="employee_number"
                                    value={values.employee_number}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.employee_number && Boolean(errors.employee_number)}
                                    helperText={touched.employee_number && errors.employee_number}
                                />

                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Phone Number"
                                    name="phone_number"
                                    value={values.phone_number}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.phone_number && Boolean(errors.phone_number)}
                                    helperText={touched.phone_number && errors.phone_number}
                                />

                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                />
                                
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: 3 }}
                                    disabled={isSubmitting}
                                >
                                    Sign Up
                                </Button>
                            </form>
                        )}
                    </Formik>
            </Paper>
        </Box>
    );
};

export default Signup;