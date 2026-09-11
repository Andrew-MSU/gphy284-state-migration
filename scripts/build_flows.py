#!/usr/bin/env python3
"""Rebuild data/flows_2024.json from Census State-to-State Migration T13 xlsx."""
import argparse, json, re
from pathlib import Path
import pandas as pd

STATES = {
 'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
 'District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
 'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota',
 'Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
 'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
 'Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah',
 'Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
}

def clean(x):
    if pd.isna(x): return None
    return re.sub(r"\s+", " ", str(x).strip())

def tonum(v):
    if pd.isna(v): return None
    if isinstance(v, (int, float)): return float(v)
    s = str(v).strip().replace(",", "")
    if s in {"X", "N", "", "-"}: return None
    return float(s)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("xlsx")
    ap.add_argument("--out", default="data/flows_2024.json")
    args = ap.parse_args()
    df = pd.read_excel(args.xlsx, sheet_name="tool_input", usecols=[0, 1, 2, 3])
    df.columns = ["o", "d", "movers", "moe"]
    df["o"] = df["o"].map(clean)
    df["d"] = df["d"].map(clean)
    df["movers"] = df["movers"].map(tonum)
    df["moe"] = df["moe"].map(tonum)
    od = df[df.o.isin(STATES) & df.d.isin(STATES) & df.movers.notna() & (df.o != df.d)]
    flows = [
        {"o": r.o, "d": r.d, "n": int(r.movers), "m": None if pd.isna(r.moe) else round(float(r.moe), 1)}
        for _, r in od.iterrows()
    ]
    Path(args.out).write_text(json.dumps(flows, separators=(",", ":")))
    print(f"Wrote {len(flows)} flows to {args.out}")

if __name__ == "__main__":
    main()
