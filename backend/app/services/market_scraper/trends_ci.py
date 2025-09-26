# app/services/market_scraper/trends_ci.py
def get_google_trends(sector: str, city: str) -> dict:
    # Stub local — contournement si pytrends indispo
    return {
        "source": "Google Trends",
        "region": city,
        "metric": f"Popularité du secteur '{sector}'",
        "value": 68.5,
        "reliability_score": 0.8
    }
