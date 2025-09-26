# app/db/seed.py
from app.db.base import engine
from app.db.models import User, BusinessPlan
from sqlmodel import Session, select
from app.core.security import hash_password
from datetime import datetime

def seed_initial_data():
    with Session(engine) as session:
        if not session.exec(select(User)).first():
            admin = User(
                email="admin@oba.ci",
                hashed_password=hash_password("adminpass"),
                role="admin",
                full_name="Admin OBA"
            )
            session.add(admin)
            session.flush()

            plans = [
                BusinessPlan(
                    owner_id=admin.id,
                    title="Atelier couture Bouaké",
                    sector="artisanat",
                    city="Bouaké",
                    requested_amount_fcfa=500_000,
                ),
                BusinessPlan(
                    owner_id=admin.id,
                    title="Livraison express pour étudiants",
                    sector="logistique",
                    city="Abidjan",
                    requested_amount_fcfa=800_000,
                ),
                BusinessPlan(
                    owner_id=admin.id,
                    title="Microcrédit planteur cacao",
                    sector="agriculture",
                    city="San Pedro",
                    requested_amount_fcfa=300_000,
                ),
            ]

            session.add_all(plans)
            session.commit()
            print("✅ Admin et 3 plans préconfigurés ajoutés")
