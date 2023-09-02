import { useDispatch } from "react-redux";
import { deleteTask } from "../redux/taskSlice";
export const Task = ({ task, setTriggerToaster, color }) => {
  //___________________________________________________ Variables
  const dispatch = useDispatch();

  //___________________________________________________ Functions

  const removeTask = () => {
    dispatch(deleteTask(task.id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled")
        setTriggerToaster({
          type: "success",
          message: `${task.name}, check 👌`,
        });
      if (res.meta.requestStatus === "rejected")
        setTriggerToaster({
          type: "error",
          message: `Une erreur est survenue: ${res.error.message} 😦`,
        });
    });
  };

  //___________________________________________________ Render
  return (
    <>
      <li
        className="task"
        style={{
          textAlign: "center",
          width: "100%",
          padding: "1rem 0",
          margin: "0",
          cursor: "pointer",
          fontSize: "1.4rem",
          fontWeight: "600",
          border: "2px solid " + (color[0] === "#" ? color : ""),
          borderImageSlice: color[0] === "l" ? "1" : "",
          borderImageSource: color[0] === "l" ? color : "",
          color: "#333",
        }}
        onClick={removeTask}
      >
        {task.name}
      </li>
    </>
  );
};
