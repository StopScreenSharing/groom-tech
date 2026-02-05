#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Groomer, Owner, Dog, Appointment
from schemas import (
    GroomerSchema,
    GroomerDashboardSchema,
    OwnerSchema,
    DogSchema,
    AppointmentSchema,
    AppointmentDetailSchema
)


# Views go here!

class Groomers(Resource):
    def post(self):
        data = request.get_json()

        groomer = Groomer(
            name=data["name"],
            employee_number=data["employee_number"],
            phone_number=data["phone_number"]
        )
        groomer.password = data["password"]

        db.session.add(groomer)
        db.session.commit()

        return GroomerSchema().dump(groomer), 201



if __name__ == '__main__':
    app.run(port=5555, debug=True)

