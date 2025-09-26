# app/services/market_scraper/ins_ci.py
def get_ins_data(sector: str, city: str) -> dict:
    return {
        "source": "INS Côte d'Ivoire",
        "region": city,
        "metric": f"Emplois déclarés dans '{sector}'",
        "value": 1540,
        "reliability_score": 0.9
    }
