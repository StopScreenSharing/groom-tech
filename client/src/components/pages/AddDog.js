import { useState } from "react";
import { Box, Stack } from "@mui/material";
import DogForm from "../DogForm";

const AddDog = () => {
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSuccess = (dog) => {
    setSuccessMessage(dog.name);
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 400 }}>

        <DogForm onSuccess={handleSuccess} successMessage={successMessage} />

      </Stack>
    </Box>
  );
};

export default AddDog;


