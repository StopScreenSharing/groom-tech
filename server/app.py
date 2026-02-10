#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Groomer, Owner, Dog, Appointment
from schemas import (
    ma,
    GroomerSchema,
    OwnerSchema,
    DogSchema,
    AppointmentSchema
)
from datetime import date


ma.init_app(app)
# Views go here!

class Signup(Resource):
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

        session["groomer_id"] = groomer.id

        return GroomerSchema().dump(groomer), 201
    


class Login(Resource):
    def post(self):
        data = request.get_json()
        groomer = Groomer.query.filter_by(employee_number=data["employee_number"]).first()
        
        if not groomer or not groomer.authenticate(data["password"]):
            return {"error": "Invalid credentials"}, 401
        
        session["groomer_id"] = groomer.id
        return GroomerSchema().dump(groomer), 200

class CheckSession(Resource):
    def get(self):
       groomer_id = session.get("groomer_id")

       if not groomer_id:
           return {"message": "Not Authorized"}, 401

       groomer = Groomer.query.get(groomer_id)
       return GroomerSchema().dump(groomer), 200        

class Logout(Resource):
    def delete(self):
        session.pop("groomer_id", None)
        return {}, 204



print("REGISTERING ROUTES")
api.add_resource(Signup, "/signup")
api.add_resource(Login, "/login")
api.add_resource(CheckSession, "/check_session")
api.add_resource(Logout, "/logout")

if __name__ == '__main__':
    app.run(port=5555, debug=True)

