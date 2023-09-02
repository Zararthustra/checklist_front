export const ConfirmDelete = ({
  categoryName,
  setIsConfirming,
  deleteCategory,
}) => (
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
        Êtes-vous sûr ?
      </h1>
      <p
        style={{
          color: "white",
          fontSize: "1.5rem",
          padding: "3rem 0",
        }}
      >
        Supprimer {categoryName} ?
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
          onClick={() => {
            deleteCategory();
            setIsConfirming(false);
          }}
          style={{
            width: "100%",
            backgroundColor: "#f13",
            padding: "1.5rem 0",
            border: "none",
            color: "#fff",
            fontSize: "1.2rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Supprimer
        </button>
        <button
          onClick={() => setIsConfirming(false)}
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
          Annuler
        </button>
      </div>
    </div>
  </div>
);
