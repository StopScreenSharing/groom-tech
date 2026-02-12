import React from "react";
import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DogForm from "../DogForm";

const AddDog = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    const res = await fetch("/dogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    });

    setSubmitting(false);

    if (res.ok) {
      navigate("/dogs");
    }
  };

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 400 }}>
        
        <Button
          variant="outlined"
          onClick={() => navigate("/dogs")}
        >
          View Dogs
        </Button>

        <DogForm onSubmit={handleSubmit} />

      </Stack>
    </Box>
  );
};

export default AddDog;


