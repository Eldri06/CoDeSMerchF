from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
CORS(app)

@app.get("/health")
def health():
    return jsonify({"status": "ok"})

@app.post("/forecast/trend")
def forecast_trend():
    data = request.get_json(force=True) or {}
    series = data.get("series", [])
    if not series:
        return jsonify({"predicted": [], "next": 0, "r2": 0})
    y = np.array([float(s.get("value", 0)) for s in series])
    X = np.arange(len(y)).reshape(-1, 1)
    model = LinearRegression().fit(X, y)
    yhat = model.predict(X)
    next_val = float(model.predict(np.array([[len(y)]]))[0])
    ss_res = float(np.sum((y - yhat) ** 2))
    ss_tot = float(np.sum((y - np.mean(y)) ** 2))
    r2 = 1 - ss_res / ss_tot if ss_tot > 0 else 0
    return jsonify({"predicted": [float(v) for v in yhat], "next": next_val, "r2": r2})

@app.post("/forecast/demand")
def forecast_demand():
    data = request.get_json(force=True) or {}
    items = data.get("items", [])
    horizon = int(data.get("horizon", 3))
    if not items:
        return jsonify({"point": 0, "lower": 0, "upper": 0, "confidence": "±0%"})
    y = np.array([float(i.get("units", 0)) for i in items])
    X = np.arange(len(y)).reshape(-1, 1)
    model = LinearRegression().fit(X, y)
    future_idx = np.arange(len(y), len(y) + horizon).reshape(-1, 1)
    future = model.predict(future_idx)
    point = float(np.sum(future))
    yhat = model.predict(X)
    resid = y - yhat
    std = float(np.std(resid))
    band = 1.96 * std * max(1, horizon)
    lower = max(0.0, point - band)
    upper = max(lower, point + band)
    conf = "±" + ("{:.0f}".format(0 if point == 0 else min(100, (band / max(point, 1e-6)) * 100))) + "%"
    return jsonify({
        "point": round(point),
        "lower": round(lower),
        "upper": round(upper),
        "confidence": conf,
        "future": [float(v) for v in future]
    })

@app.post("/forecast/errors")
def forecast_errors():
    data = request.get_json(force=True) or {}
    actual = data.get("actual", [])
    predicted = data.get("predicted", [])
    if not actual or not predicted:
        return jsonify({"hist": []})
    n = min(len(actual), len(predicted))
    resid = [float(actual[i]) - float(predicted[i]) for i in range(n)]
    bucket = {}
    for r in resid:
        b = int(round(r / 5.0) * 5)
        bucket[b] = bucket.get(b, 0) + 1
    hist = [{"error": k, "frequency": v} for k, v in sorted(bucket.items())]
    return jsonify({"hist": hist})

@app.post("/forecast/compare")
def forecast_compare():
    data = request.get_json(force=True) or {}
    rows = data.get("rows", [])
    out = []
    accs = []
    for row in rows:
        actual = float(row.get("actual", 0))
        predicted = float(row.get("predicted", 0))
        if actual > 0 and predicted > 0:
            acc = min(actual, predicted) / max(actual, predicted)
        else:
            acc = 0.0
        accs.append(acc)
        out.append({"event": row.get("event", ""), "actual": round(actual), "predicted": round(predicted), "accuracy": f"{acc*100:.1f}%"})
    avg = sum(accs) / len(accs) if accs else 0.0
    return jsonify({"rows": out, "average": f"{avg*100:.1f}%"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
