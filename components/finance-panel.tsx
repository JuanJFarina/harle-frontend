"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Edit3,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  WalletCards,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Expense, initialExpenses } from "@/lib/demo-data";

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const categories = [
  "Alquileres",
  "Servicios esenciales",
  "Servicios no esenciales",
  "Hogar",
  "Transporte",
  "Salidas",
  "Compras",
  "Otros",
];

export function FinancePanel() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const visibleExpenses = useMemo(
    () =>
      expenses.filter(
        (expense) =>
          (category === "Todas" || expense.category === category) &&
          expense.description.toLowerCase().includes(search.toLowerCase()),
      ),
    [category, expenses, search],
  );

  const spent = expenses
    .filter((expense) => expense.type === "Gasto")
    .reduce((total, expense) => total + expense.amount, 0);
  const refunded = expenses
    .filter((expense) => expense.type === "Reintegro")
    .reduce((total, expense) => total + expense.amount, 0);

  function openNew() {
    setEditing(null);
    setEditorOpen(true);
  }

  function openEdit(expense: Expense) {
    setEditing(expense);
    setEditorOpen(true);
  }

  function saveExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const expense: Expense = {
      id: editing?.id ?? `exp-${Date.now()}`,
      description: String(form.get("description")),
      category: String(form.get("category")),
      date: new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "short",
      })
        .format(new Date(`${String(form.get("date"))}T12:00:00`))
        .replace(".", ""),
      amount: Number(form.get("amount")),
      type: String(form.get("type")) as Expense["type"],
    };

    setExpenses((current) =>
      editing
        ? current.map((item) => (item.id === editing.id ? expense : item))
        : [expense, ...current],
    );
    setEditorOpen(false);
    setEditing(null);
  }

  function removeExpense(id: string) {
    setExpenses((current) => current.filter((expense) => expense.id !== id));
  }

  return (
    <>
      <div className="panel-heading">
        <div>
          <span className="panel-kicker">Finanzas personales</span>
          <h1>Tu plata, más clara.</h1>
          <p>Revisá tus movimientos y entendé cómo viene el mes.</p>
        </div>
        <button
          type="button"
          className="button button-gold"
          onClick={openNew}
        >
          <Plus size={17} />
          Nuevo movimiento
        </button>
      </div>

      <div className="finance-stats">
        <article>
          <span className="stat-icon expense">
            <ArrowUpRight size={19} />
          </span>
          <div>
            <small>Gastos del mes</small>
            <strong>{money.format(spent)}</strong>
            <span className="positive-change">
              <TrendingDown size={15} />
              8% menos que agosto
            </span>
          </div>
        </article>
        <article>
          <span className="stat-icon refund">
            <ArrowDownRight size={19} />
          </span>
          <div>
            <small>Reintegros</small>
            <strong>{money.format(refunded)}</strong>
            <span>1 movimiento</span>
          </div>
        </article>
        <article>
          <span className="stat-icon balance">
            <WalletCards size={19} />
          </span>
          <div>
            <small>Neto del mes</small>
            <strong>{money.format(spent - refunded)}</strong>
            <span>Septiembre 2026</span>
          </div>
        </article>
      </div>

      <div className="finance-overview">
        <section className="panel-card spending-chart-card">
          <div className="panel-card-title-row">
            <div>
              <h2>Evolución de gastos</h2>
              <p>Últimas seis semanas</p>
            </div>
            <select defaultValue="6">
              <option value="6">6 semanas</option>
              <option value="12">12 semanas</option>
            </select>
          </div>
          <div className="line-chart">
            <div className="chart-y-labels">
              <span>$ 100k</span>
              <span>$ 75k</span>
              <span>$ 50k</span>
              <span>$ 25k</span>
              <span>$ 0</span>
            </div>
            <div className="line-chart-area">
              <i />
              <i />
              <i />
              <i />
              <svg viewBox="0 0 600 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGold" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#d9b967" stopOpacity=".28" />
                    <stop offset="100%" stopColor="#d9b967" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  className="area-path"
                  d="M0 120 C60 106 82 65 140 75 S218 142 280 115 S350 38 420 57 S510 98 600 45 L600 180 L0 180 Z"
                />
                <path
                  className="line-path"
                  d="M0 120 C60 106 82 65 140 75 S218 142 280 115 S350 38 420 57 S510 98 600 45"
                />
                {[0, 140, 280, 420, 600].map((cx, index) => (
                  <circle
                    key={cx}
                    cx={cx}
                    cy={[120, 75, 115, 57, 45][index]}
                    r="5"
                  />
                ))}
              </svg>
              <div className="chart-x-labels">
                <span>12 ago</span>
                <span>19 ago</span>
                <span>26 ago</span>
                <span>2 sep</span>
                <span>9 sep</span>
                <span>16 sep</span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel-card category-card">
          <div className="panel-card-title-row">
            <div>
              <h2>Por categoría</h2>
              <p>Distribución del mes</p>
            </div>
          </div>
          <div className="donut" aria-label="Distribución de gastos">
            <span>{money.format(spent)}</span>
            <small>Total</small>
          </div>
          <div className="category-legend">
            <span>
              <i className="legend-home" />
              Hogar <b>36%</b>
            </span>
            <span>
              <i className="legend-shop" />
              Compras <b>27%</b>
            </span>
            <span>
              <i className="legend-services" />
              Servicios <b>21%</b>
            </span>
            <span>
              <i className="legend-other" />
              Otros <b>16%</b>
            </span>
          </div>
        </section>
      </div>

      <section className="panel-card transactions-card">
        <div className="panel-card-title-row transactions-title">
          <div>
            <h2>Movimientos recientes</h2>
            <p>{visibleExpenses.length} movimientos visibles</p>
          </div>
          <div className="transaction-filters">
            <label className="search-field">
              <Search size={17} />
              <input
                type="search"
                placeholder="Buscar movimiento"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filtrar por categoría"
            >
              <option>Todas</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="transactions-list">
          {visibleExpenses.map((expense) => (
            <div className="transaction-row" key={expense.id}>
              <span className={`transaction-mark ${expense.type.toLowerCase()}`}>
                {expense.type === "Gasto" ? (
                  <ArrowUpRight size={17} />
                ) : (
                  <ArrowDownRight size={17} />
                )}
              </span>
              <div className="transaction-main">
                <strong>{expense.description}</strong>
                <span>
                  {expense.category} · {expense.date}
                </span>
              </div>
              <strong
                className={
                  expense.type === "Gasto"
                    ? "transaction-amount"
                    : "transaction-amount refund"
                }
              >
                {expense.type === "Gasto" ? "−" : "+"}
                {money.format(expense.amount)}
              </strong>
              <div className="row-actions">
                <button
                  type="button"
                  onClick={() => openEdit(expense)}
                  aria-label={`Editar ${expense.description}`}
                >
                  <Edit3 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => removeExpense(expense.id)}
                  aria-label={`Eliminar ${expense.description}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {visibleExpenses.length === 0 && (
            <div className="empty-state">
              <Search size={25} />
              <strong>No encontramos movimientos</strong>
              <span>Probá con otro término o categoría.</span>
            </div>
          )}
        </div>
      </section>

      {editorOpen && (
        <div className="modal-backdrop" role="presentation">
          <section className="modal-card" role="dialog" aria-modal="true">
            <div className="modal-header">
              <div>
                <span className="panel-kicker">
                  {editing ? "Editar movimiento" : "Nuevo movimiento"}
                </span>
                <h2>{editing ? editing.description : "Registrá un gasto"}</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={saveExpense}>
              <div className="form-grid">
                <label>
                  Tipo
                  <select name="type" defaultValue={editing?.type ?? "Gasto"}>
                    <option>Gasto</option>
                    <option>Reintegro</option>
                  </select>
                </label>
                <label>
                  Monto
                  <input
                    type="number"
                    name="amount"
                    min="1"
                    step="0.01"
                    defaultValue={editing?.amount}
                    placeholder="0,00"
                    required
                  />
                </label>
              </div>
              <label>
                Descripción
                <input
                  type="text"
                  name="description"
                  defaultValue={editing?.description}
                  placeholder="Ej. Supermercado"
                  required
                />
              </label>
              <div className="form-grid">
                <label>
                  Categoría
                  <select
                    name="category"
                    defaultValue={editing?.category ?? "Compras"}
                  >
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Fecha
                  <input
                    type="date"
                    name="date"
                    defaultValue="2026-09-22"
                    required
                  />
                </label>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setEditorOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="button button-gold">
                  {editing ? "Guardar cambios" : "Agregar movimiento"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
