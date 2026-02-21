import { useState } from "react";
import { TEMARIOS } from "../../../utils/TEMARIO";


type Grado = keyof typeof TEMARIOS;

const TABS = Object.keys(TEMARIOS) as Grado[];

const TAB_COLORS: Record<Grado, { active: string; light: string; badge: string; text: string }> = {
  "1ro de Bachillerato": { active: "#6366f1", light: "#eef2ff", badge: "#e0e7ff", text: "#4338ca" },
  "2do de Bachillerato": { active: "#0ea5e9", light: "#f0f9ff", badge: "#dbeafe", text: "#0369a1" },
  "3ro de Bachillerato": { active: "#10b981", light: "#f0fdf4", badge: "#d1fae5", text: "#065f46" },
};

interface PlanTecnologiaProps {
  onSelectTema?: (tema: string) => void;
}

export default function PlanTecnologia({ onSelectTema }: PlanTecnologiaProps) {
  const [activeTab, setActiveTab] = useState<Grado>(TABS[0]);
  const [search, setSearch] = useState("");

  const colors = TAB_COLORS[activeTab];
  const semanas = TEMARIOS[activeTab];

  const filtered = semanas.filter(
    (s) =>
      s.tema.toLowerCase().includes(search.toLowerCase()) ||
      s.objetivos_aprendizaje.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <span role="img" aria-label="libro">📚</span> Reglas del Juego
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", margin: 0 }}>
           Plan Anual de Tecnología
        </h1>
        <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 14 }}>
          30 semanas · 1.º, 2.º y 3.º de Bachillerato
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TABS.map((tab) => {
          const c = TAB_COLORS[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearch(""); }}
              style={{
                padding: "8px 18px",
                borderRadius: 999,
                border: `2px solid ${isActive ? c.active : "#e2e8f0"}`,
                background: isActive ? c.active : "#fff",
                color: isActive ? "#fff" : "#64748b",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20, position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 16 }}>🔍</span>
        <input
          type="text"
          placeholder="Buscar tema u objetivo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px 10px 36px",
            borderRadius: 10,
            border: "1.5px solid #e2e8f0",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
            color: "#1e293b",
          }}
        />
      </div>

      {/* Counter */}
      <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
        {filtered.length} semana{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr 1fr",
          background: colors.light,
          padding: "12px 20px",
          borderBottom: `2px solid ${colors.active}20`,
          gap: 12,
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: colors.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>Sem.</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: colors.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>Tema</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: colors.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>Objetivo de aprendizaje</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
            No se encontraron resultados para "{search}"
          </div>
        ) : (
          filtered.map((s, idx) => (
            <div
              key={s.semana}
              onClick={() => onSelectTema?.(s.tema)}  
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 1fr",
                padding: "14px 20px",
                gap: 12,
                borderBottom: idx < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                alignItems: "start",
                cursor: "pointer",
                background: idx % 2 === 0 ? "#fff" : "#fafafa",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f0f7ff")}
              onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa")}
            >
              <div>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: colors.badge,
                  color: colors.text,
                  fontWeight: 700,
                  fontSize: 13,
                }}>
                  {s.semana}
                </span>
              </div>
              <div style={{ fontSize: 14, color: "#1e293b", fontWeight: 500, lineHeight: 1.5 }}>
                {s.tema}
              </div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.55 }}>
                {s.objetivos_aprendizaje}
              </div>
            </div>
          ))
        )}
      </div>

      <p style={{ fontSize: 12, color: "#cbd5e1", marginTop: 16, textAlign: "center" }}>
        Elaborado por Alfredo Alonzo Farías · Coordinador de Tecnología · 02/2025
      </p>
    </div>
  );
}