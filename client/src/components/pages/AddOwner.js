import React from "react";
import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OwnerForm from "../OwnerForm";

const AddOwner = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    const res = await fetch("/owners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    });

    setSubmitting(false);

    if (res.ok) {
      navigate("/owners");
    }
  };

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 400 }}>
        
        {/* 👇 THIS is the button you want */}
        <Button
          variant="outlined"
          onClick={() => navigate("/owners")}
        >
          View Owners
        </Button>

        <OwnerForm onSubmit={handleSubmit} />

      </Stack>
    </Box>
  );
};

export default AddOwner;
