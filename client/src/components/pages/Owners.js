import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";

const Owners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/owners", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setOwners(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Owners
      </Typography>

      <Stack spacing={2}>
        {owners.map((owner) => (
          <Paper key={owner.id} sx={{ p: 2 }}>
            <Typography variant="h6">{owner.name}</Typography>
            <Typography color="text.secondary">
              {owner.phone_number}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default Owners;
