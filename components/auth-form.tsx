"use client";

import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

type AuthFormProps = {
  mode: "login" | "register";
  initialEmail?: string;
  initialName?: string;
  selectedPlan?: string;
};

export function AuthForm({
  mode,
  initialEmail = "",
  initialName = "",
  selectedPlan = "free",
}: AuthFormProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="auth-success">
        <span>
          <Check size={28} />
        </span>
        <h2>Esta es una vista de demostración</h2>
        <p>
          La interfaz está lista. El registro y el acceso se habilitarán cuando
          el backend exponga autenticación web.
        </p>
        <Link href="/panel" className="button button-gold button-large">
          Explorar el panel
          <ArrowRight size={18} />
        </Link>
        <button type="button" onClick={() => setSubmitted(false)}>
          Volver al formulario
        </button>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {mode === "register" && (
        <>
          <label>
            Nombre
            <input
              type="text"
              name="name"
              defaultValue={initialName}
              placeholder="¿Cómo querés que te llamemos?"
              required
              autoComplete="name"
            />
          </label>
          <input type="hidden" name="plan" value={selectedPlan} />
        </>
      )}
      <label>
        Email
        <input
          type="email"
          name="email"
          defaultValue={initialEmail}
          placeholder="vos@ejemplo.com"
          required
          autoComplete="email"
        />
      </label>
      <label>
        Contraseña
        <span className="password-input">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder={
              mode === "register" ? "Mínimo 8 caracteres" : "Tu contraseña"
            }
            required
            minLength={8}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
          />
          <button
            type="button"
            onClick={() => setPasswordVisible((visible) => !visible)}
            aria-label={
              passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>

      {mode === "login" ? (
        <div className="auth-options">
          <label className="check-control">
            <input type="checkbox" name="remember" />
            <span>Recordarme</span>
          </label>
          <button type="button">Olvidé mi contraseña</button>
        </div>
      ) : (
        <label className="check-control terms-control">
          <input type="checkbox" name="terms" required />
          <span>
            Acepto los <a href="#">términos</a> y la{" "}
            <a href="#">política de privacidad</a>.
          </span>
        </label>
      )}

      <button type="submit" className="button button-gold button-large auth-submit">
        {mode === "login" ? "Ingresar" : "Crear mi cuenta"}
        <ArrowRight size={18} />
      </button>

      <div className="auth-separator">
        <span>o continuá con</span>
      </div>

      <button type="button" className="google-button" onClick={() => setSubmitted(true)}>
        <span className="google-mark">G</span>
        Google
      </button>
    </form>
  );
}
