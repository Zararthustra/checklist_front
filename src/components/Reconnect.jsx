import { useDispatch } from "react-redux";
import { refreshTokenUser } from "../redux/userSlice";
import { getLocalStorage, saveLocalStorage } from "../utils/localStorage";

export const Reconnect = ({ setTriggerToaster }) => {
  //___________________________________________________ Variables
  const dispatch = useDispatch();

  const username = getLocalStorage("username");

  //___________________________________________________ Functions
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };
  const reconnect = () => {
    dispatch(
      refreshTokenUser({
        refresh: getLocalStorage("refresh"),
      })
    )
      .then((user) => {
        if (user.meta.requestStatus === "rejected")
          return setTriggerToaster({
            type: "error",
            message: `Une erreur est survenue: ${user.error?.message} 😦`,
          });
        saveLocalStorage("username", username);
        saveLocalStorage("access", user.payload.access);
        saveLocalStorage("refresh", user.payload.refresh);
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };
  //___________________________________________________ Render

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000ea",
      }}
    >
      <div
        style={{
          overflow: "hidden",
          borderRadius: "20px 0 20px 0",
          alignItems: "center",
          textAlign: "center",
          margin: "0 1rem",
          width: "30rem",
          backgroundColor: "transparent",
        }}
      >
        <h1
          style={{
            color: "white",
            padding: "1rem 0",
            fontSize: "2.5rem",
            margin: "0",
            height: "100%",
            backgroundColor: "#333",
          }}
        >
          Session expirée
        </h1>
        <p
          style={{
            color: "white",
            fontSize: "1.5rem",
            padding: "3rem 0",
          }}
        >
          Se reconnecter en tant{" "}
          {["a", "e", "i", "o", "u", "y", "h"].includes(
            username[0].toLowerCase()
          )
            ? "qu'"
            : "que "}
          <strong>{username}</strong> ?
        </p>
        <div
          style={{
            overflow: "hidden",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#333",
          }}
        >
          <button
            onClick={reconnect}
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: "1.5rem 0",
              border: "none",
              color: "#333",
              fontSize: "1.2rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Reconnexion
          </button>
          <button
            onClick={logout}
            style={{
              width: "50%",
              backgroundColor: "#333",
              padding: "1.5rem 0",
              border: "none",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};
