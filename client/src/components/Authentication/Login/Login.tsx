import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import style from "./Login.module.css";
import { useAuth } from "../useAuth.tsx";
import logo from "../../../assets/whisp_logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const { fetchUser } = useAuth();

  const navigate = useNavigate();

  const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailInput = e.target;
    setEmail(emailInput.value);
    setEmailIsValid(emailInput.validity.valid);
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        fetchUser();
        navigate("/");
      } else {
        setLoginFailed(true);
        console.error("Failed to login user", data.error);
      }
    } catch (err) {
      console.error("Error logging in user:", err);
    }
  };

  return (
    <div className={style.pageWrapper}>
      {/* Logo */}
      <img src={logo} alt="Whisp Logo" className={style.logo} />

      <h1>Login</h1>
      {loginFailed && <p>Email or password is wrong</p>}

      <form onSubmit={onFormSubmit}>
        <label htmlFor="email">E-Mail</label>
        {email && !emailIsValid && (
          <p id="emailWrong" className={style.emailWrongWarning} role="alert">
            Please enter valid E-Mail.
          </p>
        )}
        <input
          id="email"
          name="email"
          placeholder="Enter E-Mail"
          type="email"
          value={email}
          onChange={emailChange}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={!emailIsValid || !password}
          className={
            !emailIsValid || !password ? style.btnDisabled : style.btnActive
          }
        >
          Log In
        </button>

        <p>
          If you do not have an account yet,{" "}
          <Link to="/sign-up">sign up here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
