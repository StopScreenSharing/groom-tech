import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress
} from "@mui/material";

const Dogs = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/dogs")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch dogs");
        return r.json();
      })
      .then((data) => {
        setDogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
        Dogs
      </Typography>

      {dogs.length === 0 ? (
        <Typography>No dogs found</Typography>
      ) : (
        <Grid container spacing={3}>
          {dogs.map((dog) => (
            <Grid item xs={12} md={6} lg={4} key={dog.id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">
                    {dog.name}
                  </Typography>

                  <Typography color="text.secondary">
                    Breed: {dog.breed}
                  </Typography>

                  {dog.owner && (
                    <Typography sx={{ mt: 1 }}>
                      Owner: {dog.owner.name}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Dogs;
