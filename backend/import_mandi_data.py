import urllib.request
import json
from datetime import date
from main import SessionLocal,MandiPrice

API_URL = "https://api.agmarknet.gov.in/v1/prices-and-arrivals/commodity-market/daily-report-state"
STATE_ID = 16

today = date.today().isoformat()
params = f"?date={today}&state={STATE_ID}&includeExcel=false"
url = API_URL + params
headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json, text/plain, */*",
    "Origin": "https://agmarknet.gov.in",
    "Referer": "https://agmarknet.gov.in/"
}
request = urllib.request.Request(url,headers=headers)
response = urllib.request.urlopen(request,timeout=30)
data = json.load(response)

db = SessionLocal()

count = 0

for group in data["commodityGroups"]:
    for commodity in group["commodities"]:
        for market in commodity["markets"]:
            for price in market["data"]:

                record = MandiPrice(
                    report_date=today,
                    commodity=commodity["commodityName"],
                    market=market["marketCenter"],
                    variety=price["variety"],
                    arrivals=price["arrivals"],
                    arrival_unit=price["unitOfArrivals"],
                    min_price=price["minimumPrice"],
                    max_price=price["maximumPrice"],
                    modal_price=price["modalPrice"],
                    price_unit=price["unitOfPrice"],
                    source="AGMARKNET"
                )

                db.add(record)
                count += 1

db.commit()
db.close()

print("Imported records:", count)

