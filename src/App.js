import { useEffect, useState } from "react";
import "./App.css";
import { Category } from "./components/Category";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, retrieveCategories } from "./redux/categorySlice";
import { getLocalStorage } from "./utils/localStorage";
import { Login } from "./components/Login";
import { retrieveTasks } from "./redux/taskSlice";
import { Colors } from "./utils/colors";
import { Toaster } from "./components/Toaster";

function App() {
  //___________________________________________________ Variables

  const dispatch = useDispatch();

  // const getCategoryStatus = useSelector((state) => state.category.status);
  const getCategories = useSelector((state) => state.category.category);
  const [inputCategory, setInputCategory] = useState("");
  const [triggerToaster, setTriggerToaster] = useState(null);
  const randomColorIndex = Math.floor(Math.random() * Colors.length);

  const [isAuth, setIsAuth] = useState(
    getLocalStorage("access") ? true : false
  );

  //___________________________________________________ LifeCycle

  useEffect(() => {
    if (isAuth) {
      dispatch(retrieveCategories());
      dispatch(retrieveTasks());
    }
  }, [isAuth, dispatch]);

  //___________________________________________________ Functions

  const addCategory = (event) => {
    event.preventDefault();
    if (inputCategory === "")
      return setTriggerToaster({
        type: "info",
        message: "Rien à ajouter 🧐",
      });
    dispatch(
      createCategory({ name: inputCategory, color: Colors[randomColorIndex] })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled")
        setTriggerToaster({
          type: "success",
          message: `Catégorie ${inputCategory} ajoutée 🥳`,
        });
      if (res.meta.requestStatus === "rejected")
        setTriggerToaster({
          type: "error",
          message: `Une erreur est survenue: ${res.error.message} 😦`,
        });
    });
    setInputCategory("");
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
    return false;
  };

  //___________________________________________________ Render

  if (!isAuth)
    return (
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "4rem",
        }}
      >
        {triggerToaster && (
          <Toaster
            type={triggerToaster.type}
            message={triggerToaster.message}
            setTriggerToaster={setTriggerToaster}
          />
        )}
        <Login setIsAuth={setIsAuth} setTriggerToaster={setTriggerToaster} />
      </main>
    );
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "4rem",
      }}
    >
      <svg
        onClick={logout}
        className="logout"
        width="28"
        height="32"
        viewBox="0 0 23 26"
        fill="red"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.76357 4.05375C7.06334 3.91898 7.40412 3.90769 7.71215 4.02234C8.02017 4.13698 8.27065 4.36832 8.40936 4.66628C8.54807 4.96425 8.56385 5.30485 8.45328 5.61436C8.3427 5.92387 8.11468 6.17738 7.81857 6.32C6.0109 7.15878 4.54387 8.58972 3.66033 10.3759C2.77679 12.1622 2.52972 14.1966 2.96003 16.1423C3.39033 18.0881 4.47221 19.8286 6.02656 21.0757C7.58091 22.3228 9.51453 23.0017 11.5073 23C13.4975 23.0001 15.4283 22.3215 16.9809 21.0763C18.5334 19.8311 19.6149 18.0936 20.0468 16.1508C20.4787 14.2081 20.2352 12.1761 19.3565 10.3903C18.4778 8.60459 17.0164 7.17189 15.2136 6.32875C14.9191 6.18467 14.6931 5.93069 14.5841 5.62152C14.4751 5.31236 14.4919 4.97276 14.6309 4.67588C14.7699 4.37901 15.02 4.14862 15.3273 4.03436C15.6345 3.92009 15.9744 3.9311 16.2736 4.065C18.2115 4.97073 19.8509 6.41041 20.9993 8.21511C22.1477 10.0198 22.7576 12.1146 22.7573 14.2538C22.7573 20.465 17.7198 25.5 11.5073 25.5C5.29482 25.5 0.257324 20.465 0.257324 14.2538C0.256897 12.1103 0.869102 10.0113 2.02181 8.2042C3.17453 6.39706 4.81972 4.95703 6.76357 4.05375V4.05375ZM11.5073 0.5C11.8135 0.50004 12.109 0.612445 12.3378 0.815894C12.5666 1.01934 12.7128 1.29969 12.7486 1.60375L12.7573 1.75V10.5C12.757 10.8186 12.635 11.125 12.4163 11.3567C12.1976 11.5884 11.8986 11.7278 11.5806 11.7465C11.2625 11.7651 10.9494 11.6617 10.705 11.4572C10.4607 11.2527 10.3037 10.9626 10.2661 10.6462L10.2573 10.5V1.75C10.2573 1.41848 10.389 1.10054 10.6234 0.866116C10.8579 0.631696 11.1758 0.5 11.5073 0.5V0.5Z" />
      </svg>

      {triggerToaster && (
        <Toaster
          type={triggerToaster.type}
          message={triggerToaster.message}
          setTriggerToaster={setTriggerToaster}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "4rem",
        }}
      >
        {getCategories.map((item, index) => {
          return (
            <Category
              key={index}
              category={item}
              setTriggerToaster={setTriggerToaster}
            />
          );
        })}
      </div>
      <form
        className="addCategory"
        onSubmit={addCategory}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "4rem",
          borderRadius: "20px 0",
          backgroundColor: "#333",
          overflow: "hidden",
        }}
      >
        <input
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "0px",
            outline: "none",
            border: "none",
            fontSize: "1.2rem",
            paddingLeft: "1rem",
          }}
          placeholder="Nouvelle catégorie"
          type="text"
          maxLength="40"
          value={inputCategory}
          onChange={(event) => setInputCategory(event.target.value)}
        />
        <button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            height: "100%",
            width: "40%",
            border: "none",
            backgroundColor: "transparent",
            outline: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: "white",
            fontWeight: "600",
          }}
        >
          Ajouter
        </button>
      </form>
    </main>
  );
}

export default App;
