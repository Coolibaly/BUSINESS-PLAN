# app/services/market_scraper/mtn_reports.py
def get_mtn_market_data(sector: str, city: str) -> dict:
    return {
        "source": "MTN Business",
        "region": city,
        "metric": f"Transactions mobiles dans '{sector}'",
        "value": 1250000,
        "reliability_score": 0.7
    }
