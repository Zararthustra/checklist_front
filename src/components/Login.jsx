import { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser, getTokenUser } from "../redux/userSlice";
import { saveLocalStorage } from "../utils/localStorage";
import jwt_decode from "jwt-decode";

export const Login = ({ setIsAuth, setTriggerToaster }) => {
  //___________________________________________________ Variables
  const dispatch = useDispatch();

  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isCreated, setIsCreated] = useState(false);

  //___________________________________________________ Functions

  const handleChange = (e) => {
    switch (e.target.name) {
      case "username":
        if (e.target.value.length > 10) return;
        return setName(e.target.value.trim().toLowerCase());
      case "password":
        if (e.target.value.length > 15) return;
        return setPassword(e.target.value.trim());
      default:
        break;
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    dispatch(
      getTokenUser({
        username,
        password,
      })
    )
      .then((user) => {
        if (user.error?.code === "ERR_BAD_REQUEST")
          return setTriggerToaster({
            type: "error",
            message: "Compte inconnu 🥸",
          });
        if (user.meta.requestStatus === "rejected")
          return setTriggerToaster({
            type: "error",
            message: `Une erreur est survenue: ${user.error?.message} 😦`,
          });
        if (user.meta.requestStatus === "fulfilled") {
          const decoded = jwt_decode(user.payload.access);
          saveLocalStorage("username", username);
          saveLocalStorage("userid", decoded.user_id);
          saveLocalStorage("password", password);
          saveLocalStorage("access", user.payload.access);
          saveLocalStorage("refresh", user.payload.refresh);

          setIsAuth(true);
          return setTriggerToaster({
            type: "success",
            message: `Bonjour ${
              (username && username[0]).toUpperCase() + username.slice(1)
            } 👋`,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username)
      return setTriggerToaster({
        type: "info",
        message: "Entrez un nom de compte 🙂",
      });
    if (!password)
      return setTriggerToaster({
        type: "info",
        message: "Entrez un mot de passe 🙃",
      });

    dispatch(
      createUser({
        username,
        password,
      })
    )
      .then((res) => {
        if (res.error?.code === "ERR_BAD_REQUEST")
          return setTriggerToaster({
            type: "error",
            message: "Ce nom de compte existe déjà 😖",
          });
        if (res.meta.requestStatus === "rejected")
          return setTriggerToaster({
            type: "error",
            message: `Une erreur est survenue: ${res.error?.message} 😦`,
          });
        if (res.meta.requestStatus === "fulfilled") {
          setIsCreated(true);
          return setTriggerToaster({
            type: "success",
            message: 'Compte créé ! Cliquez sur "Connexion" pour continuer 🤗',
          });
        }
      })
      .catch((err) =>
        setTriggerToaster({
          type: "error",
          message: `Une erreur est survenue: ${err} 😦`,
        })
      );
  };
  //___________________________________________________ Render
  return (
    <main
      className="loginPage"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        width: "90%",
        padding: "2rem 0",
      }}
    >
      <h1
        style={{
          fontSize: "4rem",
          backgroundColor: "#333",
          padding: "1.5rem 0",
          borderRadius: "20px 0 0 0",
          color: "white",
          margin: "0",
          width: "100%",
          textAlign: "center",
        }}
      >
        Checklist
      </h1>
      <form
        style={{
          backgroundColor: "transparent",
          borderRadius: "0 0 20px 0",
          width: "100%",
        }}
        onSubmit={handleLogin}
      >
        {!isCreated && (
          <div
            style={{
              padding: "1rem 0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <label
              style={{
                position: "relative",
                top: "1rem",
                left: "-4rem",
                padding: "0 1rem",
                fontSize: "1.5rem",
                backgroundColor: "var(--background)",
              }}
              htmlFor="username"
            >
              Compte
            </label>
            <input
              style={{
                height: "3rem",
                width: "17rem",
                border: "1px solid #333",
                outline: "none",
                paddingLeft: "1rem",
                backgroundColor: "transparent",
              }}
              required
              type="text"
              value={username}
              onChange={handleChange}
              name="username"
              id="username"
            />
          </div>
        )}
        {!isCreated && (
          <div
            style={{
              padding: "1rem 0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginBottom: "2rem",
            }}
          >
            <label
              style={{
                position: "relative",
                top: "1rem",
                left: "-2.5rem",
                padding: "0 1rem",
                fontSize: "1.5rem",
                backgroundColor: "var(--background)",
              }}
              htmlFor="password"
            >
              Mot de passe
            </label>
            <input
              style={{
                height: "3rem",
                width: "17rem",
                border: "1px solid #333",
                outline: "none",
                paddingLeft: "1rem",
                backgroundColor: "transparent",
              }}
              required
              type="password"
              value={password}
              onChange={handleChange}
              name="password"
              id="password"
            />
          </div>
        )}
        <div
          style={{
            backgroundColor: "#333",
            height: "5rem",
            padding: "0",
            borderRadius: "0 0 20px 0",
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <button
            style={{
              backgroundColor: "white",
              border: "none",
              outline: "none",
              padding: "0",
              width: "80%",
              height: "100%",
              color: "#333",
              fontWeight: "600",
              fontSize: "1.4rem",
              cursor: "pointer",
            }}
          >
            Connexion
          </button>
          {!isCreated && (
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                height: "100%",
                outline: "none",
                fontSize: "1rem",
                color: "white",
                textAlign: "center",
                width: "100%",
                fontWeight: "300",
                margin: "3rem 0",
                cursor: "pointer",
              }}
              onClick={handleRegister}
            >
              Créer un compte
            </button>
          )}
        </div>
      </form>
    </main>
  );
};
