# scripts/init_db.py

import os, sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))  # ajoute PB_GEN_BACK au PYTHONPATH

from app.db.base import init_db
from app.db.seed import seed_initial_data

if __name__ == "__main__":
    init_db()
    seed_initial_data()
    print("Base de données initialisée avec succès.")
