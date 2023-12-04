import { Task } from "./Task";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, updateCategory } from "../redux/categorySlice";
import { createTask } from "../redux/taskSlice";
import { useState } from "react";
import { Colors } from "../utils/colors";
import { ConfirmDelete } from "./ConfirmDelete";
import IconLoader from "./IconLoader";

export const Category = ({ category, setTriggerToaster }) => {
  //___________________________________________________ Variables

  const dispatch = useDispatch();
  const [inputTask, setInputTask] = useState("");
  const [newColor, setNewColor] = useState(null);
  const [showTasks, setShowTasks] = useState(!category.isHidden);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoadingTask, setIsLoadingTask] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  const categoryTasks = useSelector((state) => state.task.task).filter(
    (item) => item.category === category.id
  );
  //___________________________________________________ Functions

  const addTask = (event) => {
    event.preventDefault();
    if (inputTask === "")
      return setTriggerToaster({
        type: "info",
        message: "Rien à ajouter 🧐",
      });
    setIsLoadingTask(true);
    dispatch(createTask({ name: inputTask, categoryId: category.id })).then(
      (res) => {
        if (res.meta.requestStatus === "rejected")
          setTriggerToaster({
            type: "error",
            message: `Une erreur est survenue: ${res.error.message} 😦`,
          });
        setIsLoadingTask(false);
      }
    );
    setInputTask("");
  };

  const removeCategory = () => {
    setIsLoadingCategory(true);
    dispatch(deleteCategory(category.id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled")
        setTriggerToaster({
          type: "success",
          message: `Catégorie ${category.name} supprimée 😉`,
        });
      if (res.meta.requestStatus === "rejected")
        setTriggerToaster({
          type: "error",
          message: `Une erreur est survenue: ${res.error.message} 😦`,
        });
      setIsLoadingCategory(false);
    });
  };

  const getNewColor = () => {
    const currentColor = newColor ? newColor : category.color;
    const currentIndex = Colors.findIndex((item) => item === currentColor);
    const colorsLength = Colors.length - 1;
    const finalColor =
      Colors[currentIndex + 1 > colorsLength ? 0 : currentIndex + 1];

    return finalColor;
  };

  const changeCategoryColor = () => {
    let changeColor = getNewColor();
    dispatch(updateCategory({ id: category.id, color: changeColor })).then(
      (res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setNewColor(changeColor);
        }
        if (res.meta.requestStatus === "rejected")
          setTriggerToaster({
            type: "error",
            message: `Une erreur est survenue: ${res.error.message} 😦`,
          });
      }
    );
  };

  const hideCategory = () => {
    setShowTasks(!showTasks);
    dispatch(updateCategory({ id: category.id, isHidden: showTasks })).then(
      (res) => {
        if (res.meta.requestStatus === "rejected")
          setTriggerToaster({
            type: "error",
            message: `Une erreur est survenue: ${res.error.message} 😦`,
          });
      }
    );
  };

  //___________________________________________________ Render
  if (isLoadingCategory) return <IconLoader width={100} height={100} />;
  return (
    <>
      {isConfirming && (
        <ConfirmDelete
          setIsConfirming={setIsConfirming}
          categoryName={category.name}
          deleteCategory={removeCategory}
          isLoadingCategory={isLoadingCategory}
        />
      )}
      <div
        className="category"
        style={{
          borderRadius: "20px 0 20px",
          backgroundColor: "transparent",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            fontWeight: "600",
            background: newColor || category.color,
            transition: "all 0.5s",
            paddingBottom: "0.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: ".5rem 0",
            }}
          >
            <svg
              onClick={changeCategoryColor}
              style={{
                marginLeft: ".5rem",
                cursor: "pointer",
              }}
              width="40"
              height="40"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.875 15C21.3777 15 20.9008 14.8025 20.5492 14.4508C20.1975 14.0992 20 13.6223 20 13.125C20 12.6277 20.1975 12.1508 20.5492 11.7992C20.9008 11.4475 21.3777 11.25 21.875 11.25C22.3723 11.25 22.8492 11.4475 23.2008 11.7992C23.5525 12.1508 23.75 12.6277 23.75 13.125C23.75 13.6223 23.5525 14.0992 23.2008 14.4508C22.8492 14.8025 22.3723 15 21.875 15ZM18.125 10C17.6277 10 17.1508 9.80246 16.7992 9.45083C16.4475 9.09919 16.25 8.62228 16.25 8.125C16.25 7.62772 16.4475 7.15081 16.7992 6.79917C17.1508 6.44754 17.6277 6.25 18.125 6.25C18.6223 6.25 19.0992 6.44754 19.4508 6.79917C19.8025 7.15081 20 7.62772 20 8.125C20 8.62228 19.8025 9.09919 19.4508 9.45083C19.0992 9.80246 18.6223 10 18.125 10ZM11.875 10C11.3777 10 10.9008 9.80246 10.5492 9.45083C10.1975 9.09919 10 8.62228 10 8.125C10 7.62772 10.1975 7.15081 10.5492 6.79917C10.9008 6.44754 11.3777 6.25 11.875 6.25C12.3723 6.25 12.8492 6.44754 13.2008 6.79917C13.5525 7.15081 13.75 7.62772 13.75 8.125C13.75 8.62228 13.5525 9.09919 13.2008 9.45083C12.8492 9.80246 12.3723 10 11.875 10ZM8.125 15C7.62772 15 7.15081 14.8025 6.79917 14.4508C6.44754 14.0992 6.25 13.6223 6.25 13.125C6.25 12.6277 6.44754 12.1508 6.79917 11.7992C7.15081 11.4475 7.62772 11.25 8.125 11.25C8.62228 11.25 9.09919 11.4475 9.45083 11.7992C9.80246 12.1508 10 12.6277 10 13.125C10 13.6223 9.80246 14.0992 9.45083 14.4508C9.09919 14.8025 8.62228 15 8.125 15ZM15 3.75C12.0163 3.75 9.15483 4.93526 7.04505 7.04505C4.93526 9.15483 3.75 12.0163 3.75 15C3.75 17.9837 4.93526 20.8452 7.04505 22.955C9.15483 25.0647 12.0163 26.25 15 26.25C15.4973 26.25 15.9742 26.0525 16.3258 25.7008C16.6775 25.3492 16.875 24.8723 16.875 24.375C16.875 23.8875 16.6875 23.45 16.3875 23.125C16.1 22.7875 15.9125 22.35 15.9125 21.875C15.9125 21.3777 16.11 20.9008 16.4617 20.5492C16.8133 20.1975 17.2902 20 17.7875 20H20C21.6576 20 23.2473 19.3415 24.4194 18.1694C25.5915 16.9973 26.25 15.4076 26.25 13.75C26.25 8.225 21.2125 3.75 15 3.75Z"
                fill="white"
              />
            </svg>
            {categoryTasks.length > 0 &&
              (showTasks ? (
                <svg
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={hideCategory}
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 15C21.326 15 22.5978 15.5268 23.5355 16.4645C24.4732 17.4021 25 18.6739 25 20C25 21.3261 24.4732 22.5979 23.5355 23.5355C22.5978 24.4732 21.326 25 20 25C18.6739 25 17.4021 24.4732 16.4644 23.5355C15.5267 22.5979 15 21.3261 15 20C15 18.6739 15.5267 17.4021 16.4644 16.4645C17.4021 15.5268 18.6739 15 20 15M20 7.5C28.3333 7.5 35.45 12.6833 38.3333 20C35.45 27.3167 28.3333 32.5 20 32.5C11.6666 32.5 4.54996 27.3167 1.66663 20C4.54996 12.6833 11.6666 7.5 20 7.5ZM5.29996 20C6.64705 22.7505 8.7388 25.0679 11.3374 26.6888C13.936 28.3096 16.9373 29.1689 20 29.1689C23.0626 29.1689 26.0639 28.3096 28.6625 26.6888C31.2611 25.0679 33.3529 22.7505 34.7 20C33.3529 17.2495 31.2611 14.9321 28.6625 13.3112C26.0639 11.6904 23.0626 10.8311 20 10.8311C16.9373 10.8311 13.936 11.6904 11.3374 13.3112C8.7388 14.9321 6.64705 17.2495 5.29996 20V20Z"
                    fill="white"
                  />
                </svg>
              ) : (
                <svg
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={hideCategory}
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.80957 20C8.64195 26.9848 14.0381 30.4762 20 30.4762C25.962 30.4762 31.3581 26.9848 36.1905 20M8.57147 25.5676L4.76195 29.5238M31.4286 25.5676L35.2381 29.5238M23.8096 30.4762L25.7143 35.2381M16.1905 30.4762L14.2858 35.2381"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ))}

            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setIsConfirming(true)}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  strokeWidth="3"
                  stroke="white"
                  d="M34.2773 7.61056C34.4013 7.48659 34.4997 7.33942 34.5667 7.17745C34.6338 7.01548 34.6684 6.84188 34.6684 6.66656C34.6684 6.49124 34.6338 6.31764 34.5667 6.15567C34.4997 5.9937 34.4013 5.84653 34.2773 5.72256C34.1534 5.59859 34.0062 5.50026 33.8442 5.43317C33.6823 5.36607 33.5087 5.33154 33.3333 5.33154C33.158 5.33154 32.9844 5.36607 32.8225 5.43317C32.6605 5.50026 32.5133 5.59859 32.3893 5.72256L20 18.1146L7.61068 5.72256C7.48672 5.59859 7.33954 5.50026 7.17757 5.43317C7.0156 5.36607 6.842 5.33154 6.66668 5.33154C6.49137 5.33154 6.31777 5.36607 6.15579 5.43317C5.99382 5.50026 5.84665 5.59859 5.72268 5.72256C5.59871 5.84653 5.50038 5.9937 5.43329 6.15567C5.3662 6.31764 5.33167 6.49124 5.33167 6.66656C5.33167 6.84188 5.3662 7.01548 5.43329 7.17745C5.50038 7.33942 5.59871 7.48659 5.72268 7.61056L18.1147 19.9999L5.72268 32.3892C5.47232 32.6396 5.33167 32.9792 5.33167 33.3332C5.33167 33.6873 5.47232 34.0269 5.72268 34.2772C5.97305 34.5276 6.31261 34.6682 6.66668 34.6682C7.02075 34.6682 7.36032 34.5276 7.61068 34.2772L20 21.8852L32.3893 34.2772C32.6397 34.5276 32.9793 34.6682 33.3333 34.6682C33.6874 34.6682 34.027 34.5276 34.2773 34.2772C34.5277 34.0269 34.6684 33.6873 34.6684 33.3332C34.6684 32.9792 34.5277 32.6396 34.2773 32.3892L21.8853 19.9999L34.2773 7.61056Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
          <h2
            style={{
              fontSize: "2.2rem",
              margin: "0",
              color: "white",
              height: "100%",
            }}
          >
            {category.name.toUpperCase()}
          </h2>
        </div>
        <ul
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            listStyle: "none",
            margin: "0",
            padding: showTasks && categoryTasks.length > 0 && "1rem .5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {showTasks &&
            categoryTasks.map((item, index) => {
              return (
                <Task
                  task={item}
                  setTriggerToaster={setTriggerToaster}
                  color={newColor || category.color}
                  key={index}
                />
              );
            })}
        </ul>
        <form
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "3rem",
            overflow: "hidden",
          }}
          onSubmit={addTask}
        >
          <input
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "0px",
              outline: "none",
              border: "none",
              fontSize: "1rem",
              paddingLeft: "1rem",
            }}
            type="text"
            maxLength="80"
            value={inputTask}
            onChange={(event) => setInputTask(event.target.value)}
          />
          <button
            onClick={addTask}
            disabled={isLoadingTask}
            style={{
              height: "100%",
              width: "40%",
              border: "none",
              background: newColor || category.color,
              outline: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "white",
              fontWeight: "600",
            }}
          >
            {isLoadingTask ? (
              <IconLoader />
            ) : (
              <svg
                width="30"
                height="30"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.83337 12.5C5.13893 12.5 4.54893 12.2567 4.06337 11.77C3.57671 11.2844 3.33337 10.6944 3.33337 10C3.33337 9.30556 3.57671 8.71556 4.06337 8.23C4.54893 7.74333 5.13893 7.5 5.83337 7.5C6.52782 7.5 7.11782 7.74333 7.60337 8.23C8.09004 8.71556 8.33337 9.30556 8.33337 10C8.33337 10.6944 8.09004 11.2844 7.60337 11.77C7.11782 12.2567 6.52782 12.5 5.83337 12.5ZM5.83337 22.5C5.13893 22.5 4.54893 22.2567 4.06337 21.77C3.57671 21.2844 3.33337 20.6944 3.33337 20C3.33337 19.3056 3.57671 18.7156 4.06337 18.23C4.54893 17.7433 5.13893 17.5 5.83337 17.5C6.52782 17.5 7.11782 17.7433 7.60337 18.23C8.09004 18.7156 8.33337 19.3056 8.33337 20C8.33337 20.6944 8.09004 21.2844 7.60337 21.77C7.11782 22.2567 6.52782 22.5 5.83337 22.5ZM5.83337 32.5C5.13893 32.5 4.54893 32.2567 4.06337 31.77C3.57671 31.2844 3.33337 30.6944 3.33337 30C3.33337 29.3056 3.57671 28.7156 4.06337 28.23C4.54893 27.7433 5.13893 27.5 5.83337 27.5C6.52782 27.5 7.11782 27.7433 7.60337 28.23C8.09004 28.7156 8.33337 29.3056 8.33337 30C8.33337 30.6944 8.09004 31.2844 7.60337 31.77C7.11782 32.2567 6.52782 32.5 5.83337 32.5ZM13.3334 11.6667C12.8612 11.6667 12.465 11.5072 12.145 11.1883C11.8262 10.8683 11.6667 10.4722 11.6667 10C11.6667 9.52778 11.8262 9.13167 12.145 8.81167C12.465 8.49278 12.8612 8.33333 13.3334 8.33333H33.3334V11.6667H13.3334ZM13.3334 21.6667C12.8612 21.6667 12.465 21.5067 12.145 21.1867C11.8262 20.8678 11.6667 20.4722 11.6667 20C11.6667 19.5278 11.8262 19.1317 12.145 18.8117C12.465 18.4928 12.8612 18.3333 13.3334 18.3333H30C28.4167 18.3333 26.9306 18.6317 25.5417 19.2283C24.1528 19.8261 22.9306 20.6389 21.875 21.6667H13.3334ZM18.4584 31.6667H13.3334C12.8612 31.6667 12.465 31.5067 12.145 31.1867C11.8262 30.8678 11.6667 30.4722 11.6667 30C11.6667 29.5278 11.8262 29.1322 12.145 28.8133C12.465 28.4933 12.8612 28.3333 13.3334 28.3333H18.4584C18.375 28.8889 18.3334 29.4444 18.3334 30C18.3334 30.5556 18.375 31.1111 18.4584 31.6667ZM30 38.3333C27.6945 38.3333 25.7295 37.5211 24.105 35.8967C22.4795 34.2711 21.6667 32.3056 21.6667 30C21.6667 27.6944 22.4795 25.7289 24.105 24.1033C25.7295 22.4789 27.6945 21.6667 30 21.6667C32.3056 21.6667 34.2712 22.4789 35.8967 24.1033C37.5212 25.7289 38.3334 27.6944 38.3334 30C38.3334 32.3056 37.5212 34.2711 35.8967 35.8967C34.2712 37.5211 32.3056 38.3333 30 38.3333ZM29.1667 30.8333V34.1667C29.1667 34.3889 29.25 34.5833 29.4167 34.75C29.5834 34.9167 29.7778 35 30 35C30.2223 35 30.4167 34.9167 30.5834 34.75C30.75 34.5833 30.8334 34.3889 30.8334 34.1667V30.8333H34.1667C34.3889 30.8333 34.5834 30.75 34.75 30.5833C34.9167 30.4167 35 30.2222 35 30C35 29.7778 34.9167 29.5833 34.75 29.4167C34.5834 29.25 34.3889 29.1667 34.1667 29.1667H30.8334V25.8333C30.8334 25.6111 30.75 25.4167 30.5834 25.25C30.4167 25.0833 30.2223 25 30 25C29.7778 25 29.5834 25.0833 29.4167 25.25C29.25 25.4167 29.1667 25.6111 29.1667 25.8333V29.1667H25.8334C25.6112 29.1667 25.4167 29.25 25.25 29.4167C25.0834 29.5833 25 29.7778 25 30C25 30.2222 25.0834 30.4167 25.25 30.5833C25.4167 30.75 25.6112 30.8333 25.8334 30.8333H29.1667Z"
                  fill="white"
                />
              </svg>
            )}
          </button>
        </form>
      </div>
    </>
  );
};
