import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    Typography,
    Stack
} from "@mui/material";


const AppointmentCard = ({ appointment }) => {
    const navigate = useNavigate();

    return (
        <Card 
        sx={{
            cursor: "pointer",
            transition: "0.2s",
            "&:hover": {
                boxShadow: 6,
            },
        }}
        onClick={() => navigate(`/appointments/${appointment.id}`)}
        >
            <CardContent>
                <Stack spacing={1}>
                    <Typography variant="h6">
                        {appointment.service}
                    </Typography>

                    <Typography color="text.secondary">
                        {new Date(appointment.date).toLocaleDateString()}
                    </Typography>

                    <Typography>
                        Dog: {appointment.dog?.name}
                    </Typography>

                    <Typography>
                        Owner: {appointment.dog?.owner?.name}
                    </Typography>

                    {appointment.note && (
                        <Typography variant="body2" color="text.secondary">
                            Note: {appointment.note}
                        </Typography>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default AppointmentCard;