import React, { useState, useContext } from "react";
import { AppContext } from "../../AppContext";
import {
  Box,
  Typography,
  Grid,
  Button
} from "@mui/material";

import AppointmentCard from "../AppointmentCard";

const Home = () => {
  const { groomer } = useContext(AppContext);
  const [selectedDog, setSelectedDog] = useState(null);

  if (!groomer) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Welcome, {groomer.name}
      </Typography>

      {/* SHOW DOGS */}
      {!selectedDog && (
        <>
          <Typography variant="h5" mb={2}>
            Your Dogs
          </Typography>

          {groomer.dogs.length === 0 ? (
            <Typography>No dogs found</Typography>
          ) : (
            <Grid container spacing={3}>
              {groomer.dogs.map((dog) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  key={dog.id}
                  onClick={() => setSelectedDog(dog)}
                  sx={{
                    cursor: "pointer",
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                    "&:hover": {
                      backgroundColor: "#f5f5f5"
                    }
                  }}
                >
                  <Typography variant="h6">
                    {dog.name}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* SHOW APPOINTMENTS */}
      {selectedDog && (
        <Box sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setSelectedDog(null)}
            sx={{ mb: 2 }}
          >
            Back to Dogs
          </Button>

          <Typography variant="h5" mb={3}>
            {selectedDog.name}'s Appointments
          </Typography>

          {selectedDog.appointments.length === 0 ? (
            <Typography>No appointments</Typography>
          ) : (
            <Grid container spacing={3}>
              {selectedDog.appointments.map((apt) => (
                <Grid item xs={12} md={6} lg={4} key={apt.id}>
                  <AppointmentCard appointment={apt} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Home;
