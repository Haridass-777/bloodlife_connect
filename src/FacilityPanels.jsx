import { useState, useEffect, useCallback } from "react";
import { getInventory, setInventory, adjustInventory } from "./services/inventoryService";
import { getIncomingMatches, respondToMatch } from "./services/matchService";
import { getFacilityById, updateFacility } from "./services/facilityService";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const LOW_STOCK_THRESHOLD = 3;

export function VerifiedTag() {
  return (
    <span className="hp-verified">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
      </svg>
      VERIFIED
    </span>
  );
}

/* ---------------------------------------------------------
   Overview — quick-glance stats, shown to both hospital and
   blood bank dashboards.
--------------------------------------------------------- */
export function OverviewPanel({ facilityId, facilityType }) {
  const [rows, setRows] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [inv, m] = await Promise.all([
        getInventory(facilityId),
        getIncomingMatches(facilityId, facilityType),
      ]);
      setRows(inv);
      setMatches(m);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [facilityId, facilityType]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <p className="hp-hint">Loading overview…</p>;

  const totalUnits = rows.reduce((sum, r) => sum + (r.units_available || 0), 0);
  const stockedGroups = rows.filter((r) => (r.units_available || 0) > 0);
  const lowStock = stockedGroups.filter((r) => r.units_available < LOW_STOCK_THRESHOLD);
  const pendingMatches = matches.filter((m) => m.status === "pending");

  return (
    <section>
      <h2>Overview</h2>
      <p className="hp-sub">A quick snapshot before you dig into a specific tab.</p>
      {error && <div className="hp-error">{error}</div>}

      <div className="hp-inv-grid" style={{ marginTop: 22 }}>
        <div className="hp-inv-card">
          <div className="hp-inv-bg mono">{totalUnits}</div>
          <div className="hp-hint" style={{ marginTop: 6 }}>Total units in stock</div>
        </div>
        <div className="hp-inv-card">
          <div className="hp-inv-bg mono">{pendingMatches.length}</div>
          <div className="hp-hint" style={{ marginTop: 6 }}>Pending incoming requests</div>
        </div>
        <div className="hp-inv-card">
          <div className="hp-inv-bg mono">{lowStock.length}</div>
          <div className="hp-hint" style={{ marginTop: 6 }}>Blood groups running low</div>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="hp-error" style={{ marginTop: 22 }}>
          Running low (under {LOW_STOCK_THRESHOLD} units): {lowStock.map((r) => r.blood_group).join(", ")}
        </div>
      )}
    </section>
  );
}

/* ---------------------------------------------------------
   Inventory
--------------------------------------------------------- */
export function InventoryPanel({ facilityId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingGroup, setSavingGroup] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await getInventory(facilityId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [facilityId]);

  useEffect(() => { load(); }, [load]);

  function unitsFor(bg) {
    return rows.find((r) => r.blood_group === bg)?.units_available ?? 0;
  }

  async function handleAdjust(bg, delta) {
    setSavingGroup(bg);
    try {
      await adjustInventory(facilityId, bg, delta);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingGroup(null);
    }
  }

  async function handleSet(bg, value) {
    setSavingGroup(bg);
    try {
      await setInventory(facilityId, bg, Math.max(0, Number(value) || 0));
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingGroup(null);
    }
  }

  return (
    <section>
      <h2>Blood Inventory</h2>
      <p className="hp-sub">Kept accurate here first — this is what every nearby search checks before it reaches a donor.</p>
      {error && <div className="hp-error">{error}</div>}
      {loading ? (
        <p className="hp-hint">Loading…</p>
      ) : (
        <div className="hp-inv-grid">
          {BLOOD_GROUPS.map((bg) => (
            <div className="hp-inv-card" key={bg}>
              <div className="hp-inv-bg mono">{bg}</div>
              <input
                type="number"
                min="0"
                className="hp-inv-input"
                value={unitsFor(bg)}
                onChange={(e) => handleSet(bg, e.target.value)}
                disabled={savingGroup === bg}
              />
              <div className="hp-inv-actions">
                <button className="btn btn-ghost" onClick={() => handleAdjust(bg, -1)} disabled={savingGroup === bg}>−1</button>
                <button className="btn btn-ghost" onClick={() => handleAdjust(bg, 1)} disabled={savingGroup === bg}>+1</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

