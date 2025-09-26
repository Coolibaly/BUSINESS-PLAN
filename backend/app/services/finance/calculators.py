# app/services/finance/calculators.py
from typing import Iterable, Optional, List
import math

# Tente d'utiliser numpy-financial (npv/irr), sinon fallback pur Python
try:
    import numpy_financial as npf  # pip install numpy-financial
except Exception:
    npf = None


def break_even_units(prix: float, cout_variable: float, cout_fixe: float) -> float:
    """
    Seuil de rentabilité en unités = CF / (P - CV)
    Protégé contre la division par ~0.
    """
    return cout_fixe / max((prix - cout_variable), 1e-6)


def break_even_revenue(prix: float, cout_variable: float, cout_fixe: float) -> float:
    """
    Seuil de rentabilité en chiffre d'affaires.
    """
    return break_even_units(prix, cout_variable, cout_fixe) * prix


def npv(rate: float, cashflows: Iterable[float]) -> float:
    """
    Valeur actuelle nette :
    NPV = Σ_{t=0..n} CF_t / (1 + rate)^t
    """
    cfs: List[float] = list(cashflows)
    if npf is not None:
        return float(npf.npv(rate, cfs))
    # Fallback pur Python
    return sum(cf / ((1.0 + rate) ** t) for t, cf in enumerate(cfs))


def irr(cashflows: Iterable[float], guess: float = 0.1) -> Optional[float]:
    """
    Taux de rentabilité interne (par période).
    Renvoie None s'il n'y a pas de solution (pas de changement de signe) ou non convergence.
    """
    cfs: List[float] = list(cashflows)

    # L’IRR n’existe pas sans changement de signe des flux
    if not any(a * b < 0 for a, b in zip(cfs, cfs[1:])):
        return None

    if npf is not None:
        val = npf.irr(cfs)
        try:
            # npf.irr peut retourner NaN si non convergence
            return float(val) if val == val else None  # NaN check
        except Exception:
            return None

    # Fallback Newton-Raphson
    r = guess
    for _ in range(100):
        # éviter r = -1
        if abs(1.0 + r) < 1e-12:
            r += 1e-3

        # f(r) = NPV(r)
        f = sum(cf / ((1.0 + r) ** t) for t, cf in enumerate(cfs))
        # f'(r) = dérivée de la NPV par rapport à r
        df = sum(-t * cf / ((1.0 + r) ** (t + 1)) for t, cf in enumerate(cfs) if t > 0)

        if abs(f) < 1e-7:
            return r
        if df == 0:
            r += 1e-3
            continue

        r_new = r - f / df
        if not math.isfinite(r_new):
            return None
        if abs(r_new - r) < 1e-7:
            return r_new
        r = r_new

    return None  # non convergence


def gross_margin_pct(revenue: float, cogs: float) -> float:
    """
    Marge brute (%) = (CA - Coût des ventes) / CA * 100
    """
    return 100.0 * (revenue - cogs) / revenue if revenue else 0.0


def opex_to_revenue(opex: float, revenue: float) -> float:
    """
    OPEX / CA (%)
    """
    return 100.0 * opex / revenue if revenue else 0.0


def dscr(ebitda: float, debt_service: float) -> float:
    """
    Debt Service Coverage Ratio = EBITDA / Service de la dette
    """
    return ebitda / debt_service if debt_service else 0.0
