import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppointmentForm from "../AppointmentForm";
import { AppContext } from "../../AppContext";
import { useContext } from "react";

const AddAppointment = () => {
  const navigate = useNavigate();
  const { groomer, setGroomer } = useContext(AppContext);

  const handleSubmit = (values, { setSubmitting, setStatus }) => {
    setStatus(null);

    fetch("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    })
      .then((res) =>
        res.json().then((data) => {
          if (!res.ok) throw new Error(data.error || "Failed to create appointment");
          return data;
        })
      )
      .then((newAppointment) => {
        setGroomer((prevGroomer) => {
          const dogs = prevGroomer.dogs || [];
          const newApt = {
            id: newAppointment.id,
            date: newAppointment.date,
            service: newAppointment.service,
            note: newAppointment.note,
          };
          const dogId = newAppointment.dog?.id ?? newAppointment.dog_id;

          const existingDog = dogs.find((d) => d.id === dogId);

          if (existingDog) {
            const updatedDogs = dogs.map((dog) => {
              if (dog.id === dogId) {
                const currentAppointments = dog.appointments || [];
                return { ...dog, appointments: [...currentAppointments, newApt] };
              }
              return dog;
            });
            return { ...prevGroomer, dogs: updatedDogs };
          } else {
            const dog = newAppointment.dog;
            const dogWithNewAppointment = { ...dog, appointments: [newApt] };
            return { ...prevGroomer, dogs: [...dogs, dogWithNewAppointment] };
          }
        });

        navigate("/");
      })
      .catch((err) => setStatus(err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 400 }}>
        <Button variant="outlined" onClick={() => navigate("/")}>
          View Appointments
        </Button>

        <AppointmentForm onSubmit={handleSubmit} />
      </Stack>
    </Box>
  );
};

export default AddAppointment;
