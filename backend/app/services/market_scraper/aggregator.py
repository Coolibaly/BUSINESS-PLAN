# app/services/market_scraper/aggregator.py
from app.services.market_scraper.trends_ci import get_google_trends
from app.services.market_scraper.ins_ci import get_ins_data
from app.services.market_scraper.mtn_reports import get_mtn_market_data

def collect_all_sources(sector: str, city: str) -> list[dict]:
    try:
        return [
            get_google_trends(sector, city),
            get_ins_data(sector, city),
            get_mtn_market_data(sector, city)
        ]
    except Exception:
        return []
