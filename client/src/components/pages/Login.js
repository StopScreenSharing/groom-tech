import React, { useContext, useEffect } from "react";
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

import { AppContext } from "../../AppContext";

const LoginSchema = Yup.object({
    employee_number: Yup.string()
        .matches(/^\d{4}$/, "Employee number must be 4 digits")
        .required("Employee number is required"),
    password: Yup.string().required("Password is required"),
});

function Login() {
    const navigate = useNavigate();
    const { login, groomer } = useContext(AppContext);

    //  if already logged in
    useEffect(() => {
        if (groomer) {
            navigate("/", { replace: true });
        }
    }, [groomer, navigate]);

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
                        const result = await login(
                            values.employee_number,
                            values.password
                        );

                        setSubmitting(false);

                        if (result === true) {
                            navigate("/", { replace: true });
                        } else {
                            setErrors({
                                server:
                                    result.error ||
                                    "Invalid employee number or password",
                            });
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
                                <Alert severity="error" sx={{ mb: 2 }}>
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
                                error={
                                    touched.employee_number &&
                                    Boolean(errors.employee_number)
                                }
                                helperText={
                                    touched.employee_number &&
                                    errors.employee_number
                                }
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
                                error={
                                    touched.password &&
                                    Boolean(errors.password)
                                }
                                helperText={
                                    touched.password && errors.password
                                }
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