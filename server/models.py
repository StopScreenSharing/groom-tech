from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
import re
from datetime import date
from config import db, bcrypt

# Models go here!

ALLOWED_SERVICES = {"Bath", "Nails", "Brush", "Full Groom"}

class Groomer(db.Model):
    __tablename__ = 'groomers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    phone_number = db.Column(db.String(10), nullable=False)
    employee_number = db.Column(db.String(4), nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)

    #Relationships
    appointments = db.relationship("Appointment", backref="groomer", cascade="all, delete-orphan")
    dogs = db.relationship("Dog", secondary="appointments", primaryjoin="Groomer.id==Appointment.groomer_id", secondaryjoin="Dog.id==Appointment.dog_id",viewonly=True)
    owners = db.relationship("Owner", secondary="appointments", primaryjoin="Groomer.id==Appointment.groomer_id", secondaryjoin="Owner.id==Dog.owner_id", viewonly=True)

    #Validation
    @validates('name')
    def validate_name(self, key, name):
        if not name or not name.strip():
            raise ValueError("Name is required")
        
        name = name.strip()
    
        if not re.match(r"^[A-Za-z\s'.-]+$", name):
            raise ValueError("Name contains invalid characters")
        
        if len(name) > 80:
            raise ValueError("Name is too long")
        return name
    
    @validates('phone_number')
    def validate_phone(self, key, number):
        number = number.strip()
        if not number.isdigit() or len(number) != 10:
            raise ValueError("Phone number must be 10 digits")
        return number
    
    @validates('employee_number')
    def validate_employee_number(self, key, value):
        value = value.strip()
        if not value.isdigit() or len(value) != 4:
            raise ValueError("Employee number must be 4 digits")
        return value

    
    #Password Handling
    @hybrid_property
    def password(self):
        raise AttributeError("Password is write-only.")
    
    @password.setter
    def password(self, plaintext_password):
        hashed = bcrypt.generate_password_hash(
            plaintext_password.encode("utf-8")
        ).decode("utf-8")

        self._password_hash = hashed
    
    def authenticate(self, plaintext_password):
        return bcrypt.check_password_hash(
            self._password_hash,
            plaintext_password.encode("utf-8")
        )
    def __repr__(self):
        return f'<Groomer {self.name} Id: {self.id}>'


class Owner(db.Model):
    __tablename__ = 'owners'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    phone_number = db.Column(db.String(10), nullable=False)

    #Relationships
    dogs = db.relationship("Dog", backref="owner", cascade="all, delete-orphan")
    #Owner -> Dog -> Appointment
    appointments = db.relationship("Appointment", secondary="dogs", primaryjoin="Owner.id==Dog.owner_id", secondaryjoin="Appointment.dog_id==Dog.id", viewonly=True)
    groomers = db.relationship("Groomer", secondary="appointments", primaryjoin="Owner.id==Dog.owner_id", secondaryjoin="Appointment.groomer_id==Groomer.id", viewonly=True)

    #Validation
    @validates('name')
    def valididate_name(self, key, name):
        if not name or not name.strip():
            raise ValueError("Name is required")
        
        name = name.strip()
        if not re.match(r"^[A-Za-z\s'.-]+$", name):
            raise ValueError("Name contains invalid characters")
        if len(name) > 80:
            raise ValueError("Name is too long")
        return name
    
    @validates('phone_number')
    def validate_phone(self, key, number):
        number = number.strip()
        if not number.isdigit() or len(number) != 10:
            raise ValueError("Phone number must be 10 digits")
        return number
    

    def __repr__(self):
        return f'<Owner {self.name} Id:{self.id}>'


class Dog(db.Model):
    __tablename__ = 'dogs'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False)
    breed = db.Column(db.String(40), nullable=False)
    
    #Relationships
    owner_id = db.Column(db.Integer, db.ForeignKey("owners.id"), nullable=False)
    appointments = db.relationship("Appointment", backref="dog", cascade="all, delete-orphan" )
    groomers = db.relationship("Groomer", secondary="appointments", primaryjoin="Dog.id==Appointment.dog_id", secondaryjoin="Appointment.groomer_id==Groomer.id", viewonly=True)

    #Validation
    @validates('name')
    def validate_name(self, key, name):
        if not name or not name.strip():
            raise ValueError("Name is required")
        name = name.strip()

        if len(name) > 40:
            raise ValueError("Name is too long")
        if not re.match(r"^[A-Za-z\s'.-]+$", name):
            raise ValueError("Name has invalid characters")
        return name

    @validates('breed')
    def validate_breed(self, key, breed):
        breed = breed.strip()

        if not breed:
            return None
        
        if len(breed) > 40:
            raise ValueError("Breed name is too long")
        
        if not re.match(r"^[A-Za-z\s'.-]+$", breed):
            raise ValueError("Breed contains invalid chracters")
        return breed


    def __repr__(self):
        return f'<Dog {self.name} Id:{self.id}>'


class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    service = db.Column(db.String, nullable=False)
    note = db.Column(db.String(300), nullable=True)

    #Relationships
    groomer_id = db.Column(db.Integer, db.ForeignKey("groomers.id"), nullable=False)
    dog_id = db.Column(db.Integer, db.ForeignKey("dogs.id"), nullable=False)
    owner = db.relationship("Owner", secondary="dogs", primaryjoin="Dog.id==Appointment.dog_id", secondaryjoin="Owner.id==Dog.owner_id", viewonly=True)

    #Validation
    @validates('service')
    def validate_service(self, key, service):
        if not service or not service.strip():
            raise ValueError("Service required")
        service = service.strip()
        if service not in ALLOWED_SERVICES:
            raise ValueError(
                f"Service must be one of: {', '.join(ALLOWED_SERVICES)}"
            )
        return service
    
    @validates('date')
    def validate_date(self, key, appointment_date):
        if not appointment_date:
            raise ValueError("Appointment date is required")
        if appointment_date < date.today():
            raise ValueError("Appointment date cannot be in the past")
        return appointment_date

    @validates('note')
    def validate_note(self, key, value):
        if value is None:
            return value
        value = value.strip()
        if len(value) > 300:
            raise ValueError("Note cannot exceed 300 characters")
        return value


    def __repr__(self):
        return f'<Appointment {self.service} on {self.date}>'

