# app/utils/pagination.py
from fastapi import Query

def get_pagination_params(page: int = Query(1, ge=1), limit: int = Query(10, le=100)):
    offset = (page - 1) * limit
    return {"offset": offset, "limit": limit}
