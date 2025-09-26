# 📘 OBA Business Plan Backend

Backend API pour générer automatiquement des business plans bancaires professionnels adaptés aux jeunes entrepreneurs ivoiriens (OBA – Orange Bank Afrique).

## 🚀 Lancement local

```bash
git clone https://github.com/ton-org/oba-business-plan.git
cd oba-business-plan
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python scripts/init_db.py
bash scripts/run_dev.sh