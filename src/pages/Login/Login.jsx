// src/pages/Login/Login.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useIdioma } from "../../context/IdiomaContext";
import fondoImg from "../../assets/imagenes/MasterGraf.png";
import styles from "./Login.module.css";

export default function Login() {
  const { login } = useAuth();
  const { t }     = useIdioma();
  const nav       = useNavigate();

  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [remember, setRem]    = useState(false);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("savedEmail");
    if (saved) { setEmail(saved); setRem(true); }
  }, []);

  const onSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      remember
        ? localStorage.setItem("savedEmail", email)
        : localStorage.removeItem("savedEmail");
      nav("/graficos1");
    } catch (err) {
      setError(err.message || t("error_login"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${fondoImg})` }}
    >
      <h1 className={styles.logo}>MasterGraf</h1>

      <form className={styles.form} onSubmit={onSubmit}>
        <h2 className={styles.title}>{t("Bienvenido")}</h2>
        {error && <div className={styles.error}>{error}</div>}

        <label className={styles.label}>
          {t("Usuario")}
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          {t("Contraseña")}
          <div className={styles.passwordWrapper}>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={e => setPass(e.target.value)}
              required
              className={styles.input}
            />
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setShowPass(!showPass)}
              aria-label={showPass ? t("Ocultar contraseña") : t("Mostrar contraseña")}
              title={showPass ? t("Ocultar contraseña") : t("Mostrar contraseña")}
            >
              {showPass ? (
                // 👁️ Ojo abierto
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                // 🚫 Ojo tachado
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12a10.94 10.94 0 0 1 2.58-3.94" />
                  <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8a10.94 10.94 0 0 1-4.83 5.76" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>
        </label>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={remember}
            onChange={e => {
              setRem(e.target.checked);
              if (!e.target.checked) localStorage.removeItem("savedEmail");
            }}
          />
          {t("Recordar email")}
        </label>

        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? `${t("Ingresar")}…` : t("Ingresar")}
        </button>
      </form>
    </div>
  );
}