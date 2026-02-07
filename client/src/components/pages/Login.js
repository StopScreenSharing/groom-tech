import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object({
    employee_number: Yup.string()
    .matches(/^\d{4}$/, "Employee number must be 4 digits")
    .required("Employee number is required"),
    password: Yup.string().required("Password is required"),
});

function Login() {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Groomer Login
                </Typography>

                <Formik
                    initialValues={{
                        employee_number: "",
                        password: "",
                    }}
                    validationSchema={LoginSchema}
                    onSubmit={async (values, { setSubmitting, setErrors }) => {
                        try {
                            const res = await fetch("/login", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(values),
                            });

                            if (!res.ok) {
                                const err = await res.json();
                                setErrors({ server: err.error || "Login failed "});
                                return;
                            }
                            // On success
                            await res.json();
                            navigate("/");
                        } catch (error) {
                            setErrors({ server: "Something went wrong" });
                        } finally {
                            setSubmitting(false);
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
                            {errors.server && (
                                <Alert severity="error" sx={{ mb:2 }}>
                                    {errors.server}
                                </Alert>
                            )}

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
                                label="Password"
                                type="password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Log In
                            </Button>
                        </form>
                    )}
                </Formik>
            </Box>
        </Container>
    );
}

export default Login;