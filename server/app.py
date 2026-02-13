#!/usr/bin/env python3

# Standard library imports

# Remote library imports
import resource
from flask import request, session
from flask_migrate import current
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api
# Add your model imports
from models import Groomer, Owner, Dog, Appointment
from schemas import (
    ma,
    GroomerSchema,
    OwnerSchema,
    DogSchema,
    AppointmentSchema,
    DogDropdownSchema
)
from datetime import date


ma.init_app(app)
# Views go here!

def current_groomer():
    groomer_id = session.get("groomer_id")
    if not groomer_id:
        return None
    return Groomer.query.get(groomer_id)

class Signup(Resource):
    def post(self):
        data = request.get_json()

        try:
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

        except ValueError as e:
            db.session.rollback()
            return {"error": str(e)}, 400

        except IntegrityError as e:
            db.session.rollback()
            if "UNIQUE constraint failed: groomers.employee_number" in str(e.orig):
                return {"error": "Employee number already taken"}, 400
            return {"error": "Something went wrong"}, 500
    


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

class Appointments(Resource):
    # def get(self):
    #     groomer = current_groomer()
    #     if not groomer:
    #         return {"error": "Not authorized"}, 401
        
    #     appointments = Appointment.query.filter_by(
    #         groomer_id=groomer.id
    #     ).all()

    #     return AppointmentSchema(many=True).dump(appointments), 200
    
    def post(self):
        groomer = current_groomer()
        if not groomer:
            return {"error": "Not authorized"}, 401
        
        data = request.get_json()

        try:
            appointment = Appointment(
                date=date.fromisoformat(data["date"]),
                service=data["service"],
                note=data.get("note"),
                dog_id=data["dog_id"],
                groomer_id=groomer.id
            )

            db.session.add(appointment)
            db.session.commit()

            return AppointmentSchema().dump(appointment), 201
        except ValueError as e:
            db.session.rollback()
            return {"error": str(e)}, 400
    
class AppointmentById(Resource):
    def get(self, id):
        groomer = current_groomer()
        if not groomer:
            return {"error": "Not authorized"}, 401
        
        appointment = Appointment.query.get(id)

        if not appointment or appointment.groomer_id != groomer.id:
            return {"error": "Appointment not found"}, 404
        
        return AppointmentSchema().dump(appointment), 200
    
    def patch(self, id):
        groomer = current_groomer()
        if not groomer:
            return {"error": "Not authorized"}, 401

        appointment = Appointment.query.get(id)

        if not appointment or appointment.groomer_id != groomer.id:
            return {"error": "Appointment not found"}, 404

        data = request.get_json()

        try:
            if "date" in data:
                appointment.date = date.fromisoformat(data["date"])
            if "service" in data:
                appointment.service = data["service"]
            if "note" in data:
                appointment.note = data["note"]

            db.session.commit()
            return AppointmentSchema().dump(appointment), 200

        except ValueError as e:
            db.session.rollback()
        return {"error": str(e)}, 400

    
    
        
    
    def delete(self, id):
        groomer = current_groomer()
        if not groomer:
            return {"error": "Not authorized"}, 401
        
        appointment = Appointment.query.get(id)

        if not appointment or appointment.groomer_id != groomer.id:
            return {"error": "Appointment not found"}, 404
        
        db.session.delete(appointment)
        db.session.commit()

        return {}, 204

class Owners(Resource):
    def get(self):
        groomer = current_groomer()
        if not groomer:
            return {"error": "Not Authorized"}, 401
        
        owners = Owner.query.all()
        return OwnerSchema(many=True).dump(owners), 200

    def post(self):  
        groomer = current_groomer()
        if not groomer:
            return {"error": "Not Authorized"}, 401
          
        data = request.get_json()

        owner = Owner(
            name=data["name"],
            phone_number=data["phone_number"]
        )
        
        db.session.add(owner)
        db.session.commit()

        return OwnerSchema().dump(owner), 201

class Dogs(Resource): 
    def get(self):
        groomer = current_groomer()
        if not groomer:
            return {"error": "Not authorized"}, 401

        dogs = Dog.query.all()
        return DogDropdownSchema(many=True).dump(dogs), 200

    def post(self):
        groomer = current_groomer()
        if not groomer:
            return {"error": "Not authorized"}, 401
        
        data = request.get_json()

        owner = Owner.query.get(data["owner_id"])
        if not owner:
            return {"error": "Owner not found"}, 404

        dog = Dog(
            name=data["name"],
            breed=data["breed"],
            owner_id=data["owner_id"]
        )

        db.session.add(dog)
        db.session.commit()

        return DogSchema().dump(dog), 201




print("REGISTERING ROUTES")
api.add_resource(Signup, "/signup")
api.add_resource(Login, "/login")
api.add_resource(CheckSession, "/check_session")
api.add_resource(Logout, "/logout")
api.add_resource(Appointments, "/appointments")
api.add_resource(AppointmentById, "/appointments/<int:id>")
api.add_resource(Owners, "/owners")
api.add_resource(Dogs, "/dogs")


if __name__ == '__main__':
    app.run(port=5555, debug=True)

