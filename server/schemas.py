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
    note = ma.auto_field()
    dog_id = ma.auto_field()

    dog = fields.Nested("DogSchema")

class OwnerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Owner
        load_instance = True
    id = ma.auto_field()
    name = ma.auto_field()
    phone_number = ma.auto_field()

    dogs = fields.Nested("DogSchema", many=True, exclude=("owner", "appointments"))


class DogSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Dog
        load_instance = True
    
    id = ma.auto_field()
    name = ma.auto_field()
    breed = ma.auto_field()

    owner = fields.Nested("OwnerSchema", only=("id", "name"))
    appointments = fields.Nested("AppointmentSchema", many=True, exclude=("dog",))

class DogDropdownSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Dog
        load_instance = True
        exclude = ("breed", "appointments")
    
    id = ma.auto_field()
    name = ma.auto_field()
    owner = fields.Nested("OwnerSchema", only=("name", "phone_number"))

class GroomerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Groomer
        load_instance = True
        exclude = ("_password_hash",)
    id = ma.auto_field()
    name = ma.auto_field()
    employee_number = ma.auto_field()
    phone_number = ma.auto_field()

    dogs = fields.Nested("DogSchema", many=True)





