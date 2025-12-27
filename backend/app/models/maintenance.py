from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, Date, DateTime, Numeric, Enum, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class Department(Base):
    __tablename__ = "departments"
    department_id = Column(Integer, primary_key=True, index=True)
    department_name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    users = relationship("User", back_populates="department")
    equipment = relationship("Equipment", back_populates="department")

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True)
    password_hash = Column(Text) 
    phone = Column(String(20))
    avatar_url = Column(Text)
    role = Column(String(50), nullable=False) 
    department_id = Column(Integer, ForeignKey("departments.department_id"))
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    department = relationship("Department", back_populates="users")


class EquipmentCategory(Base):
    __tablename__ = "equipment_categories"
    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)

class MaintenanceTeam(Base):
    __tablename__ = "maintenance_teams"
    team_id = Column(Integer, primary_key=True, index=True)
    team_name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)

    members = relationship("MaintenanceTeamMember", back_populates="team")

class MaintenanceTeamMember(Base):
    __tablename__ = "maintenance_team_members"
    team_member_id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey("maintenance_teams.team_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)

    team = relationship("MaintenanceTeam", back_populates="members")
    user = relationship("User", back_populates="teams")

class Equipment(Base):
    __tablename__ = "equipment"
    equipment_id = Column(Integer, primary_key=True, index=True)
    equipment_name = Column(String(150), nullable=False)
    serial_number = Column(String(100), unique=True, nullable=False)
    category_id = Column(Integer, ForeignKey("equipment_categories.category_id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.department_id"))
    assigned_user_id = Column(Integer, ForeignKey("users.user_id"))
    maintenance_team_id = Column(Integer, ForeignKey("maintenance_teams.team_id"), nullable=False)
    default_technician_id = Column(Integer, ForeignKey("users.user_id"))
    purchase_date = Column(Date)
    warranty_end_date = Column(Date)
    location = Column(String(150))
    is_scrapped = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    department = relationship("Department", back_populates="equipment")
    category = relationship("EquipmentCategory")


class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"
    request_id = Column(Integer, primary_key=True, index=True)
    request_number = Column(String(50), unique=True, nullable=False)
    subject = Column(Text, nullable=False) 
    description = Column(Text)
    
    equipment_id = Column(Integer, ForeignKey("equipment.equipment_id"), nullable=False)
    category_id = Column(Integer, ForeignKey("equipment_categories.category_id"), nullable=False)
    team_id = Column(Integer, ForeignKey("maintenance_teams.team_id"), nullable=False)
    
    request_type_id = Column(Integer, nullable=False)
    status_id = Column(Integer, nullable=False) 
    
    requested_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.user_id"))
    
    scheduled_date = Column(Date)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    duration_hours = Column(Numeric(5, 2))
    
    created_at = Column(DateTime, server_default=func.now())