"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Edit3,
  LoaderCircle,
  Plus,
  Save,
  Search,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";
import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDashboardSession } from "@/components/dashboard-session";
import {
  BudgetCategory,
  BudgetPercentages,
  createExpense,
  createInstallmentExpense,
  deleteExpense,
  ExpenseCategory,
  ExpenseEntryType,
  ExpenseTransaction,
  FinanceDashboard,
  getFinanceDashboard,
  HarleApiError,
  saveBudget,
  saveIncome,
  updateExpense,
} from "@/lib/harle-api";

const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  rent: "Alquileres",
  essential_services: "Servicios esenciales",
  non_essential_services: "Servicios no esenciales",
  home: "Hogar",
  transport: "Transporte",
  outings: "Salidas",
  shopping: "Compras",
  other: "Otros",
  savings: "Ahorro",
};
const EXPENSE_CATEGORIES = Object.keys(CATEGORY_LABELS).filter(
  (category) => category !== "savings",
) as ExpenseCategory[];
const BUDGET_CATEGORIES = Object.keys(CATEGORY_LABELS) as BudgetCategory[];
const EMPTY_BUDGET = Object.fromEntries(
  BUDGET_CATEGORIES.map((category) => [category, "0"]),
) as BudgetPercentages;

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

export function FinancePanel() {
  const session = useDashboardSession();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
  );
  const [dashboard, setDashboard] = useState<FinanceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ExpenseCategory | "all">("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<ExpenseTransaction | null>(null);
  const selectedMonthRef = useRef(selectedMonth);
  const requestIdRef = useRef(0);

  const load = useCallback(
    async (monthToLoad: string, signal?: AbortSignal) => {
      const requestId = ++requestIdRef.current;
      const [year, month] = monthToLoad.split("-").map(Number);
      try {
        const result = await getFinanceDashboard(year, month, signal);
        if (
          !signal?.aborted &&
          requestId === requestIdRef.current &&
          monthToLoad === selectedMonthRef.current
        ) {
          setDashboard(result);
          setError(null);
        }
      } catch (caught) {
        if (
          !signal?.aborted &&
          requestId === requestIdRef.current &&
          monthToLoad === selectedMonthRef.current
        ) {
          setDashboard(null);
          setError(apiMessage(caught));
        }
      } finally {
        if (
          !signal?.aborted &&
          requestId === requestIdRef.current &&
          monthToLoad === selectedMonthRef.current
        ) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestIdRef.current;
    const [year, month] = selectedMonth.split("-").map(Number);
    void getFinanceDashboard(year, month, controller.signal)
      .then((result) => {
        if (
          requestId === requestIdRef.current &&
          selectedMonth === selectedMonthRef.current
        ) {
          setDashboard(result);
          setError(null);
        }
      })
      .catch((caught: unknown) => {
        if (
          !controller.signal.aborted &&
          requestId === requestIdRef.current &&
          selectedMonth === selectedMonthRef.current
        ) {
          setDashboard(null);
          setError(apiMessage(caught));
        }
      })
      .finally(() => {
        if (
          !controller.signal.aborted &&
          requestId === requestIdRef.current &&
          selectedMonth === selectedMonthRef.current
        ) {
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [selectedMonth]);

  const visibleTransactions = useMemo(
    () =>
      (dashboard?.transactions ?? []).filter(
        (transaction) =>
          (category === "all" || transaction.category === category) &&
          transaction.description.toLowerCase().includes(search.toLowerCase()),
      ),
    [category, dashboard?.transactions, search],
  );

  async function mutate(action: () => Promise<unknown>) {
    setSaving(true);
    try {
      await action();
      await load(selectedMonthRef.current);
      return true;
    } catch (caught) {
      setError(apiMessage(caught));
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function submitIncome(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await mutate(() =>
      saveIncome(
        String(form.get("amount")),
        String(form.get("effective_on")),
        session.csrf_token,
      ),
    );
  }

  async function submitBudget(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const percentages = Object.fromEntries(
      BUDGET_CATEGORIES.map((item) => [item, String(form.get(item))]),
    ) as BudgetPercentages;
    const total = Object.values(percentages).reduce(
      (sum, value) => sum + Number(value),
      0,
    );
    if (Math.abs(total - 100) > 0.001) {
      setError("La distribución del presupuesto debe sumar exactamente 100%.");
      return;
    }
    await mutate(() => saveBudget(percentages, session.csrf_token));
  }

  async function submitExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const entryType = String(form.get("entry_type")) as ExpenseEntryType;
    const installmentCount = Number(form.get("installment_count") || 1);
    const base = {
      category: String(form.get("category")) as ExpenseCategory,
      transaction_date: String(form.get("transaction_date")),
      description: String(form.get("description")),
    };
    const succeeded = await mutate(() => {
      if (editing) {
        return updateExpense(
          editing.transaction_id,
          {
            ...base,
            amount: String(form.get("amount")),
            entry_type: entryType,
          },
          session.csrf_token,
        );
      }
      if (installmentCount > 1) {
        return createInstallmentExpense(
          {
            ...base,
            total_amount: String(form.get("amount")),
            installment_count: installmentCount,
          },
          session.csrf_token,
        );
      }
      return createExpense(
        {
          ...base,
          amount: String(form.get("amount")),
          entry_type: entryType,
        },
        session.csrf_token,
      );
    });
    if (succeeded) {
      setEditorOpen(false);
      setEditing(null);
    }
  }

  async function remove(transaction: ExpenseTransaction) {
    const scope = transaction.installment_group_id
      ? "Se eliminará permanentemente toda la compra en cuotas."
      : "Se eliminará permanentemente este movimiento.";
    if (!window.confirm(`${scope} ¿Querés continuar?`)) {
      return;
    }
    await mutate(() =>
      deleteExpense(transaction.transaction_id, session.csrf_token),
    );
  }

  const budgetValues = budgetPercentages(dashboard);
  const budgetTotal = Object.values(budgetValues).reduce(
    (sum, value) => sum + Number(value),
    0,
  );

  return (
    <>
      <div className="panel-heading">
        <div>
          <span className="panel-kicker">Finanzas personales</span>
          <h1>Tu plata, más clara.</h1>
          <p>Compará gastos, ingreso y objetivos para cada categoría.</p>
        </div>
        <div className="form-grid">
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => {
              selectedMonthRef.current = event.target.value;
              setDashboard(null);
              setError(null);
              setLoading(true);
              setSelectedMonth(event.target.value);
            }}
            aria-label="Mes analizado"
          />
          <button
            type="button"
            className="button button-gold"
            onClick={() => {
              setEditing(null);
              setEditorOpen(true);
            }}
          >
            <Plus size={17} /> Nuevo movimiento
          </button>
        </div>
      </div>

      {error && <div className="dashboard-session-state" role="alert">{error}</div>}
      {loading && !dashboard ? (
        <div className="dashboard-session-state">
          <LoaderCircle className="spin" size={28} />
          <strong>Cargando tus finanzas…</strong>
        </div>
      ) : (
        dashboard && (
          <>
            <div className="finance-stats">
              <Stat
                title="Ingreso mensual"
                value={dashboard.income?.amount ?? null}
                icon={<WalletCards size={19} />}
                detail={
                  dashboard.income
                    ? `Vigente desde ${formatDate(dashboard.income.effective_on)}`
                    : "Todavía no configurado"
                }
              />
              <Stat
                title="Gastos netos"
                value={dashboard.net_expenses}
                icon={<ArrowUpRight size={19} />}
                detail={`${money.format(Number(dashboard.gross_refunds))} reintegrados`}
              />
              <Stat
                title="Disponible"
                value={dashboard.remaining_income}
                icon={<ArrowDownRight size={19} />}
                detail={
                  dashboard.savings_target
                    ? `Objetivo de ahorro ${money.format(Number(dashboard.savings_target))}`
                    : "Configurá ingreso y presupuesto"
                }
              />
            </div>

            <div className="panel-columns">
              <form
                key={`${selectedMonth}-${dashboard.income?.effective_on ?? "none"}-${dashboard.income?.amount ?? "none"}`}
                className="panel-card settings-card"
                onSubmit={submitIncome}
              >
                <div className="panel-card-title-row">
                  <div>
                    <h2>Ingreso neto mensual</h2>
                    <p>Guardamos el historial según la fecha de vigencia.</p>
                  </div>
                </div>
                <div className="form-grid">
                  <label>
                    Importe en ARS
                    <input
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      defaultValue={dashboard.income?.amount ?? ""}
                      required
                    />
                  </label>
                  <label>
                    Vigente desde
                    <input
                      name="effective_on"
                      type="date"
                      max={todayIso()}
                      defaultValue={todayIso()}
                      required
                    />
                  </label>
                </div>
                <button className="button button-gold" disabled={saving}>
                  <Save size={16} /> Guardar ingreso
                </button>
                {dashboard.income_history.length > 0 && (
                  <small>
                    Historial:{" "}
                    {dashboard.income_history
                      .map(
                        (item) =>
                          `${formatDate(item.effective_on)} · ${money.format(Number(item.amount))}`,
                      )
                      .join(" · ")}
                  </small>
                )}
              </form>

              <form className="panel-card settings-card" onSubmit={submitBudget}>
                <div className="panel-card-title-row">
                  <div>
                    <h2>Presupuesto mensual</h2>
                    <p>
                      Distribuí el 100% del ingreso. Ahorro es un objetivo, no un
                      gasto.
                    </p>
                  </div>
                  <strong>{budgetTotal.toLocaleString("es-AR")}%</strong>
                </div>
                <div className="form-grid">
                  {BUDGET_CATEGORIES.map((item) => (
                    <label key={`${item}-${budgetValues[item]}`}>
                      {CATEGORY_LABELS[item]}
                      <input
                        name={item}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        defaultValue={budgetValues[item]}
                        required
                      />
                    </label>
                  ))}
                </div>
                <button className="button button-gold" disabled={saving}>
                  <Save size={16} /> Guardar distribución
                </button>
              </form>
            </div>

            <div className="finance-overview">
              <section className="panel-card spending-chart-card">
                <div className="panel-card-title-row">
                  <div>
                    <h2>Evolución de gastos</h2>
                    <p>Últimas seis semanas</p>
                  </div>
                </div>
                <div className="finance-trend-bars">
                  {dashboard.trend.map((point) => {
                    const maximum = Math.max(
                      1,
                      ...dashboard.trend.map((item) =>
                        Math.max(0, Number(item.net_spent)),
                      ),
                    );
                    return (
                      <div key={point.week_starts_on}>
                        <i
                          style={{
                            height: `${Math.max(4, (Math.max(0, Number(point.net_spent)) / maximum) * 140)}px`,
                          }}
                        />
                        <small>{formatShortDate(point.week_starts_on)}</small>
                      </div>
                    );
                  })}
                </div>
              </section>
              <section className="panel-card category-card">
                <div className="panel-card-title-row">
                  <div>
                    <h2>Presupuesto por categoría</h2>
                    <p>Uso real frente al objetivo mensual</p>
                  </div>
                </div>
                <div className="category-legend">
                  {dashboard.categories.map((item) => (
                    <span key={item.category}>
                      {CATEGORY_LABELS[item.category]}{" "}
                      <b>
                        {money.format(Number(item.actual_amount))} /{" "}
                        {item.budget_amount
                          ? money.format(Number(item.budget_amount))
                          : "sin objetivo"}
                      </b>
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <section className="panel-card transactions-card">
              <div className="panel-card-title-row transactions-title">
                <div>
                  <h2>Movimientos</h2>
                  <p>{visibleTransactions.length} movimientos visibles</p>
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
                    onChange={(event) =>
                      setCategory(event.target.value as ExpenseCategory | "all")
                    }
                  >
                    <option value="all">Todas</option>
                    {EXPENSE_CATEGORIES.map((item) => (
                      <option value={item} key={item}>
                        {CATEGORY_LABELS[item]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="transactions-list">
                {visibleTransactions.map((transaction) => (
                  <div className="transaction-row" key={transaction.transaction_id}>
                    <span
                      className={`transaction-mark ${transaction.entry_type}`}
                    >
                      {transaction.entry_type === "expense" ? (
                        <ArrowUpRight size={17} />
                      ) : (
                        <ArrowDownRight size={17} />
                      )}
                    </span>
                    <div className="transaction-main">
                      <strong>{transaction.description}</strong>
                      <span>
                        {CATEGORY_LABELS[transaction.category]} ·{" "}
                        {formatDate(transaction.transaction_date)}
                        {transaction.installment_number &&
                          ` · cuota ${transaction.installment_number}/${transaction.installment_count}`}
                      </span>
                    </div>
                    <strong className="transaction-amount">
                      {transaction.entry_type === "expense" ? "−" : "+"}
                      {money.format(Number(transaction.amount))}
                    </strong>
                    <div className="row-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(transaction);
                          setEditorOpen(true);
                        }}
                        aria-label={`Editar ${transaction.description}`}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(transaction)}
                        aria-label={`Eliminar ${transaction.description}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {visibleTransactions.length === 0 && (
                  <div className="empty-state">
                    <Search size={25} />
                    <strong>No hay movimientos para mostrar</strong>
                  </div>
                )}
              </div>
            </section>
          </>
        )
      )}

      {editorOpen && (
        <ExpenseEditor
          editing={editing}
          saving={saving}
          onClose={() => {
            setEditorOpen(false);
            setEditing(null);
          }}
          onSubmit={submitExpense}
        />
      )}
    </>
  );
}

function Stat({
  title,
  value,
  detail,
  icon,
}: {
  title: string;
  value: string | null;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <article>
      <span className="stat-icon balance">{icon}</span>
      <div>
        <small>{title}</small>
        <strong>{value === null ? "—" : money.format(Number(value))}</strong>
        <span>{detail}</span>
      </div>
    </article>
  );
}

function ExpenseEditor({
  editing,
  saving,
  onClose,
  onSubmit,
}: {
  editing: ExpenseTransaction | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  const [entryType, setEntryType] = useState<ExpenseEntryType>(
    editing?.entry_type ?? "expense",
  );
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal-card" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <span className="panel-kicker">
              {editing ? "Editar movimiento" : "Nuevo movimiento"}
            </span>
            <h2>{editing?.description ?? "Registrá un movimiento"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        {editing?.installment_group_id && (
          <p role="alert">
            Los cambios se aplicarán a toda la compra en cuotas, conservando la
            cantidad de cuotas.
          </p>
        )}
        <form className="modal-form" onSubmit={(event) => void onSubmit(event)}>
          <div className="form-grid">
            <label>
              Tipo
              <select
                name="entry_type"
                value={entryType}
                disabled={Boolean(editing?.installment_group_id)}
                onChange={(event) =>
                  setEntryType(event.target.value as ExpenseEntryType)
                }
              >
                <option value="expense">Gasto</option>
                <option value="refund">Reintegro</option>
              </select>
              {editing?.installment_group_id && (
                <input type="hidden" name="entry_type" value="expense" />
              )}
            </label>
            <label>
              {editing?.installment_group_id ? "Monto total" : "Monto"}
              <input
                type="number"
                name="amount"
                min="0.01"
                step="0.01"
                defaultValue={
                  editing?.installment_group_id ? undefined : editing?.amount
                }
                placeholder={
                  editing?.installment_group_id
                    ? "Nuevo total de la compra"
                    : undefined
                }
                required
              />
            </label>
          </div>
          <label>
            Descripción
            <input
              name="description"
              defaultValue={editing?.description}
              required
            />
          </label>
          <div className="form-grid">
            <label>
              Categoría
              <select name="category" defaultValue={editing?.category ?? "shopping"}>
                {EXPENSE_CATEGORIES.map((item) => (
                  <option value={item} key={item}>
                    {CATEGORY_LABELS[item]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Fecha
              <input
                type="date"
                name="transaction_date"
                defaultValue={editing?.transaction_date ?? todayIso()}
                required
              />
            </label>
          </div>
          {!editing && entryType === "expense" && (
            <label>
              Cuotas
              <input
                type="number"
                name="installment_count"
                min="1"
                max="12"
                defaultValue="1"
              />
            </label>
          )}
          <div className="modal-actions">
            <button type="button" className="button button-outline" onClick={onClose}>
              Cancelar
            </button>
            <button className="button button-gold" disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function budgetPercentages(dashboard: FinanceDashboard | null): BudgetPercentages {
  if (!dashboard?.budget) {
    return EMPTY_BUDGET;
  }
  return {
    ...EMPTY_BUDGET,
    ...Object.fromEntries(
      dashboard.budget.allocations.map((item) => [
        item.category,
        item.percentage,
      ]),
    ),
  };
}

function apiMessage(error: unknown): string {
  return error instanceof HarleApiError
    ? error.message
    : "No pudimos completar la operación.";
}

function todayIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T12:00:00`));
}
