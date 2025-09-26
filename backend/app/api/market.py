# app/api/market.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.core.deps import get_db, get_current_user
from app.db.models import BusinessPlan
from app.services.finance.models import MarketData
from app.services.market_scraper.aggregator import collect_all_sources
from app.schemas.market import MarketDataOut
from datetime import date

router = APIRouter()


@router.post("/collect")
def collect_market(
    sector: str = Query(...),
    city: str = Query(...),
    plan_id: int = Query(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    plan = db.get(BusinessPlan, plan_id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")

    results = collect_all_sources(sector, city)
    for entry in results:
        db.add(MarketData(
            plan_id=plan_id,
            source=entry["source"],
            region=entry["region"],
            metric=entry["metric"],
            value=entry["value"],
            reliability_score=entry["reliability_score"],
            as_of=date.today()
        ))
    db.commit()
    return {"detail": "Sources collectées", "count": len(results)}


@router.get("/{plan_id}/data", response_model=list[MarketDataOut])
def get_market_data(plan_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    plan = db.get(BusinessPlan, plan_id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")
    return db.exec(select(MarketData).where(MarketData.plan_id == plan_id)).all()
