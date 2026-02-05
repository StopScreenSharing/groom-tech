from flask_marshmallow import Marshmallow
from marshmallow import fields
from models import Groomer, Owner, Dog, Appointment

ma = Marshmallow()

class AppointmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Appointment
        load_instance = True
    id = ma.auto_field()
    date = ma.auto_field()
    service = ma.auto_field()

# For single appointment 
class AppointmentDetailSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Appointment
        load_instance = True
    id = ma.auto_field()
    date = ma.auto_field()
    service = ma.auto_field()
    note = ma.auto_field()

    dog = fields.Nested("DogSchema")
    groomer = fields.Nested("GroomerSchema", only=("id", "name"))

class DogSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Dog
        load_instance = True
    
    id = ma.auto_field()
    name = ma.auto_field()
    breed = ma.auto_field()

    appointments = fields.Nested(
        "AppointmentSchema",
        many=True
    )

    owner = fields.Nested(
        "OwnerSchema",
        only=("id", "name")
    )

class GroomerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Groomer
        load_instance = True
    id = ma.auto_field()
    name = ma.auto_field()
    employee_number = ma.auto_field()
    phone_number = ma.auto_field()


class GroomerDashboardSchema(GroomerSchema):
    appointments = fields.Nested(
        AppointmentSchema,
        many=True
    )

    dogs = fields.Nested(
        DogSchema,
        many=True,
        exclude=("appointments",)
    )

class OwnerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Owner
        load_instance = True
    id = ma.auto_field()
    name = ma.auto_field()
    phone_number = ma.auto_field()

    dogs = fields.Nested(
        DogSchema,
        many=True,
        exclude=("appointments",)
    )





