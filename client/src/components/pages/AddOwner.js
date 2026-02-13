import { useState } from "react";
import { Box, Stack } from "@mui/material";
import OwnerForm from "../OwnerForm";

const AddOwner = () => {
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    const res = await fetch("/owners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    });

    setSubmitting(false);

    if (res.ok) {
      const owner = await res.json();
      setSuccessMessage(owner.name);
      setTimeout(() => setSuccessMessage(null), 2000);
    }
  };

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 400 }}>

        <OwnerForm onSubmit={handleSubmit} successMessage={successMessage} />

      </Stack>
    </Box>
  );
};

export default AddOwner;
