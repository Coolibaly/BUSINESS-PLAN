#!/usr/bin/env bash
# Test all OBA Business Plan API endpoints (robuste, avec fallback / ou pas)
set -Eeuo pipefail

# --------- Config par défaut (surchargables via env) ---------
BASE_URL="${BASE_URL:-http://127.0.0.1:8000}"

# Données aléatoires (pour ne pas se cogner aux doublons)
SUFFIX="$(date +%s)$RANDOM"
EMAIL="${EMAIL:-oba.tester+$SUFFIX@example.com}"
PASSWORD="${PASSWORD:-OBA!Test$SUFFIX}"
FULL_NAME="${FULL_NAME:-OBA Tester $SUFFIX}"
PHONE="${PHONE:-07$RANDOM$RANDOM}"

PLAN_TITLE="${PLAN_TITLE:-OBA Mini Market $SUFFIX}"
PLAN_SECTOR="${PLAN_SECTOR:-Retail}"
PLAN_CITY="${PLAN_CITY:-Abidjan}"
PLAN_AMOUNT="${PLAN_AMOUNT:-7500000}"

# Tests optionnels
TEST_SSE="${TEST_SSE:-true}"
LOGO_PATH="${LOGO_PATH:-}"      # ex: /path/logo.png
AUDIO_PATH="${AUDIO_PATH:-}"     # ex: /path/audio.wav
KB_DOC_PATH="${KB_DOC_PATH:-}"   # ex: /path/doc.txt

# --------- Helpers ---------
require() { command -v "$1" >/dev/null 2>&1 || { echo "❌ Missing dependency: $1"; exit 1; }; }
json() { jq -r "$1" 2>/dev/null || true; }

# Requête générique : retente en inversant le slash final si 404
req() {
  local method="$1"; shift
  local path="$1"; shift
  local data="${1:-}"; shift || true
  local headers=("$@")
  local url="$BASE_URL$path"
  local tmp_body; tmp_body="$(mktemp)"
  local code

  if [[ -n "$data" ]]; then
    code=$(curl -sS -L -o "$tmp_body" -w '%{http_code}' -X "$method" "$url" \
      -H 'Content-Type: application/json' "${headers[@]}" --data "$data")
  else
    code=$(curl -sS -L -o "$tmp_body" -w '%{http_code}' -X "$method" "$url" "${headers[@]}")
  fi

  if [[ "$code" == "404" ]]; then
    if [[ "$path" == */ ]]; then path="${path%/}"; else path="$path/"; fi
    url="$BASE_URL$path"
    if [[ -n "$data" ]]; then
      code=$(curl -sS -L -o "$tmp_body" -w '%{http_code}' -X "$method" "$url" \
        -H 'Content-Type: application/json' "${headers[@]}" --data "$data")
    else
      code=$(curl -sS -L -o "$tmp_body" -w '%{http_code}' -X "$method" "$url" "${headers[@]}")
    fi
  fi

  cat "$tmp_body"
  rm -f "$tmp_body"
}

# SSE simple (affiche 5 premières lignes), avec fallback slash
req_sse() {
  local method="$1"; shift
  local path="$1"; shift
  local headers=("$@")
  local url="$BASE_URL$path"
  local code

  code=$(curl -sS -N -H 'Accept: text/event-stream' -o /dev/null -w '%{http_code}' -X "$method" "$url" "${headers[@]}" || true)
  if [[ "$code" == "404" ]]; then
    if [[ "$path" == */ ]]; then path="${path%/}"; else path="$path/"; fi
    url="$BASE_URL$path"
  fi
  curl -sS -N -H 'Accept: text/event-stream' -X "$method" "$url" "${headers[@]}" | sed -n '1,5p'
}

# --------- Pré-requis ---------
require curl
require jq
echo "▶ BASE_URL=$BASE_URL"
echo "▶ EMAIL=$EMAIL"

# --------- 0) Santé ---------
echo -e "\n#0 GET /admin/metrics"
req GET "/admin/metrics" | jq . || true

# --------- 1) Auth: register + login + me ---------
echo -e "\n#1 POST /auth/register"
REGISTER_PAYLOAD=$(jq -n --arg email "$EMAIL" --arg pw "$PASSWORD" --arg fn "$FULL_NAME" --arg ph "$PHONE" \
  '{email: $email, password: $pw, full_name: $fn, phone: $ph}')
REGISTER_RESP=$(req POST "/auth/register" "$REGISTER_PAYLOAD")
echo "$REGISTER_RESP" | jq . || true

echo -e "\n#2 POST /auth/login"
LOGIN_PAYLOAD=$(jq -n --arg email "$EMAIL" --arg pw "$PASSWORD" '{email: $email, password: $pw}')
LOGIN_RESP=$(req POST "/auth/login" "$LOGIN_PAYLOAD")
echo "$LOGIN_RESP" | jq . || true

ACCESS_TOKEN=$(echo "$LOGIN_RESP" | json '.access_token')
[[ -z "$ACCESS_TOKEN" || "$ACCESS_TOKEN" == "null" ]] && { echo "❌ Unable to obtain access token. Aborting."; exit 1; }
AUTH_HEADER=(-H "Authorization: Bearer $ACCESS_TOKEN")

echo -e "\n#3 GET /auth/me"
req GET "/auth/me" "" "${AUTH_HEADER[@]}" | jq .

# --------- 4) Business plans: create + list + get ---------
echo -e "\n#4 POST /business-plans"
PLAN_PAYLOAD=$(jq -n --arg t "$PLAN_TITLE" --arg s "$PLAN_SECTOR" --arg c "$PLAN_CITY" --argjson amt "$PLAN_AMOUNT" \
  '{title: $t, sector: $s, city: $c, requested_amount_fcfa: $amt}')
PLAN_RESP=$(req POST "/business-plans" "$PLAN_PAYLOAD" "${AUTH_HEADER[@]}")
echo "$PLAN_RESP" | jq . || true

PLAN_ID=$(echo "$PLAN_RESP" | jq -r '.id // .plan_id // .data.id // .result.id // empty')
if [[ -z "$PLAN_ID" || "$PLAN_ID" == "null" ]]; then
  echo "ℹ️ No id from creation; fallback to list."
  LIST_RESP=$(req GET "/business-plans" "" "${AUTH_HEADER[@]}")
  PLAN_ID=$(echo "$LIST_RESP" | jq -r '.[-1].id // .data[-1].id // .results[-1].id // empty' || true)
fi
[[ -z "$PLAN_ID" || "$PLAN_ID" == "null" ]] && { echo "❌ No plan id available. Aborting."; exit 1; }
echo "PLAN_ID=$PLAN_ID"

echo -e "\n#5 GET /business-plans (list)"
req GET "/business-plans" "" "${AUTH_HEADER[@]}" | jq '.[]? | {id, title, sector, city, status} // .data? // .results?' || true

echo -e "\n#5b GET /business-plans/{id}"
req GET "/business-plans/$PLAN_ID" "" "${AUTH_HEADER[@]}" | jq . || true

# --------- 6) Finance: save assumptions + KPI ---------
echo -e "\n#6 POST /finance/{plan_id}/assumptions"
ASSUMPTIONS=$(jq -n '{
  pricing: 12000,
  variable_costs: 7000,
  fixed_costs: 1500000,
  salaries: 600000,
  taxes: 250000,
  capex: 1800000,
  loan_rate: 0.10,
  loan_duration: 24,
  seasonality: [1.05,0.95,1.00,1.10,1.00,0.98,1.12,1.00,0.97,1.03,1.00,1.08],
  growth_rates: [0.015,0.015,0.02,0.02,0.02,0.02,0.018,0.018,0.015,0.015,0.015,0.015],
  start_date: "2025-02-01"
}')
req POST "/finance/$PLAN_ID/assumptions" "$ASSUMPTIONS" "${AUTH_HEADER[@]}" | jq .

echo -e "\n#7 GET /finance/{plan_id}/kpi"
req GET "/finance/$PLAN_ID/kpi?rate=0.12" "" "${AUTH_HEADER[@]}" | jq . || true

# --------- 8) Generation: all + sections + SSE (opt) ---------
echo -e "\n#8 POST /generate/{plan_id}/all (non-SSE)"
req POST "/generate/$PLAN_ID/all" "" "${AUTH_HEADER[@]}" | jq . || true

if [[ "$TEST_SSE" == "true" ]]; then
  echo -e "\n#8a POST /generate/{plan_id}/all?sse=true (SSE: 5 lignes)"
  req_sse POST "/generate/$PLAN_ID/all?sse=true" "${AUTH_HEADER[@]}" || true
fi

echo -e "\n#8b POST /generate/{plan_id}/{section}"
for s in exec_summary activity market marketing ops hr finance; do
  echo "Section => $s"
  req POST "/generate/$PLAN_ID/$s" "" "${AUTH_HEADER[@]}" | jq . || true
done

# --------- 9) Market: collect + data ---------
echo -e "\n#9 POST /market/collect"
req POST "/market/collect?sector=$PLAN_SECTOR&city=$PLAN_CITY&plan_id=$PLAN_ID" "" "${AUTH_HEADER[@]}" | jq . || true

echo -e "\n#9b GET /market/{plan_id}/data"
req GET "/market/$PLAN_ID/data" "" "${AUTH_HEADER[@]}" | jq . || true

# --------- 10) Export: PDF + PPTX (+ job) ---------
echo -e "\n#10 POST /export/{plan_id}/pdf"
EXPORT_PDF_RESP=$(req POST "/export/$PLAN_ID/pdf" "" "${AUTH_HEADER[@]}")
echo "$EXPORT_PDF_RESP" | jq . || true
PDF_JOB_ID=$(echo "$EXPORT_PDF_RESP" | json '.id // .job_id // .data.id // empty')

echo -e "\n#10b GET /export/jobs/{job_id} (if available)"
if [[ -n "${PDF_JOB_ID:-}" && "$PDF_JOB_ID" != "null" ]]; then
  req GET "/export/jobs/$PDF_JOB_ID" "" "${AUTH_HEADER[@]}" | jq . || true
fi

echo -e "\n#10c POST /export/{plan_id}/pptx"
req POST "/export/$PLAN_ID/pptx" "" "${AUTH_HEADER[@]}" | jq . || true

# --------- 11) Advice: generate + list ---------
echo -e "\n#11 POST /advice/{plan_id}/generate"
req POST "/advice/$PLAN_ID/generate" "" "${AUTH_HEADER[@]}" | jq . || true

echo -e "\n#11b GET /advice/{plan_id}"
req GET "/advice/$PLAN_ID" "" "${AUTH_HEADER[@]}" | jq . || true

# --------- 12) Intake ---------
echo -e "\n#12 POST /intake"
req POST "/intake" '{"raw_text":"Projet: mini-market moderne à Abidjan (Retail). Besoin 3 800 000 FCFA pour aménagement, stock initial et marketing."}' | jq . || true

# --------- 13) Files (optionnels si chemins fournis) ---------
if [[ -n "${LOGO_PATH}" && -f "${LOGO_PATH}" ]]; then
  echo -e "\n#13a POST /files/{plan_id}/logo (multipart)"
  # toggle slash si besoin
  UPLOAD_URL="$BASE_URL/files/$PLAN_ID/logo"
  code=$(curl -sS -o /dev/null -w '%{http_code}' -X POST "$UPLOAD_URL" "${AUTH_HEADER[@]}" -F "uploaded=@${LOGO_PATH}" || true)
  if [[ "$code" == "404" ]]; then
    UPLOAD_URL="$UPLOAD_URL/"
  fi
  curl -sS -X POST "$UPLOAD_URL" "${AUTH_HEADER[@]}" -F "uploaded=@${LOGO_PATH}" | jq . || true
else
  echo -e "\n#13a Files upload skipped (set LOGO_PATH to enable)"
fi

if [[ -n "${AUDIO_PATH}" && -f "${AUDIO_PATH}" ]]; then
  echo -e "\n#13b POST /files/audio:transcribe (multipart)"
  URL="$BASE_URL/files/audio:transcribe"
  code=$(curl -sS -o /dev/null -w '%{http_code}' -X POST "$URL" -F "file=@${AUDIO_PATH}" || true)
  [[ "$code" == "404" ]] && URL="$URL/"
  curl -sS -X POST "$URL" -F "file=@${AUDIO_PATH}" | jq . || true
else
  echo -e "\n#13b Audio transcription skipped (set AUDIO_PATH to enable)"
fi

# --------- 14) Knowledge base (optionnelle) ---------
if [[ -n "${KB_DOC_PATH}" && -f "${KB_DOC_PATH}" ]]; then
  echo -e "\n#14a POST /knowledge/ingest (multipart)"
  URL="$BASE_URL/knowledge/ingest"
  code=$(curl -sS -o /dev/null -w '%{http_code}' -X POST "$URL" "${AUTH_HEADER[@]}" -F "file=@${KB_DOC_PATH}" || true)
  [[ "$code" == "404" ]] && URL="$URL/"
  curl -sS -X POST "$URL" "${AUTH_HEADER[@]}" -F "file=@${KB_DOC_PATH}" | jq . || true

  echo -e "\n#14b GET /knowledge/search?q=financement"
  req GET "/knowledge/search?q=financement" "" "${AUTH_HEADER[@]}" | jq . || true
else
  echo -e "\n#14 Knowledge base skipped (set KB_DOC_PATH to enable)"
fi

# --------- 15) Admin ---------
echo -e "\n#15 GET /admin/metrics (open)"
req GET "/admin/metrics" | jq . || true

echo -e "\n#15b GET /admin/audit (requires admin role) — expected 403 if non-admin"
req GET "/admin/audit" "" "${AUTH_HEADER[@]}" | jq . || true

echo -e "\n#15c GET /admin/config (requires admin role) — expected 403 now"
req GET "/admin/config" "" "${AUTH_HEADER[@]}" | jq . || true

echo -e "\n✅ All tests attempted. PLAN_ID=$PLAN_ID"
