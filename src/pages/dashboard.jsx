import { useState, useEffect } from "react";
import NavbarComponent from "../components/navbar";
import "../css/login.css";
import { useNavigate } from "react-router-dom";
import CreateTaskModal from "../modals/createTask";
import UpdateTaskModal from "../modals/updateTask";
import DeleteModal from "../modals/deleteTask";
import emptyBoxImage from "../../src/images/empty_box.png";

export default function Dashboard() {
  const navigate = useNavigate();

  const [pointer, setPointer] = useState({ start: 0, end: 4 });
  const [tasks, setTasks] = useState([]);

  function checkTaskSuccess(check) {
    if (check) readAllTasks();
  }

  async function readAllTasks() {
    await fetch(`${process.env.REACT_APP_API_URL}/task/read-all`, {
      method: "GET",
      headers: {
        authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then(async (data) => {
        let result = await data;
        setTasks(result);
        // console.log(result);
      });
  }

  function handleNext() {
    setPointer({ start: pointer.start + 5, end: pointer.end + 5 });
  }
  function handlePrev() {
    setPointer({ start: pointer.start - 5, end: pointer.end - 5 });
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
    } else {
      readAllTasks();
    }
  }, [navigate]);
  return (
    <>
      <NavbarComponent />
      <h1 style={{ textAlign: "center", marginTop: "5%", marginBottom: "2%" }}>
        Manage Your Tasks Here
      </h1>
      <div className="center-of-the-screen">
        {tasks.length > 0 ? (
          <>
            <table>
              <tbody>
                <tr>
                  <th>S.No</th>
                  <th>Task</th>
                  <th>Description</th>
                  <th>Completed</th>
                  <th>
                    Actions{" "}
                    <CreateTaskModal checkTaskSuccess={checkTaskSuccess} />
                  </th>
                </tr>
                {tasks
                  .slice(pointer.start, pointer.end + 1)
                  .map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + pointer.start + 1}</td>
                      <td>{item.task_name}</td>
                      <td>{item.description}</td>
                      <td>{item.completed ? "Yes" : "No"}</td>
                      <td>
                        <UpdateTaskModal
                          id={item._id}
                          checkTaskSuccess={checkTaskSuccess}
                        />
                        <DeleteModal
                          id={item._id}
                          checkTaskSuccess={checkTaskSuccess}
                        />
                      </td>
                    </tr>
                  ))}
                <tr>
                  <td
                    onClick={handlePrev}
                    style={{ float: "left" }}
                    className="removeBorder"
                  >
                    {pointer.start === 0 ? (
                      <button disabled>&lt;</button>
                    ) : (
                      <button>&lt;</button>
                    )}
                  </td>
                  <td className="removeBorder"></td>
                  <td className="removeBorder"></td>
                  <td className="removeBorder"></td>
                  <td
                    onClick={handleNext}
                    style={{ float: "right" }}
                    className="removeBorder"
                  >
                    {pointer.end + 1 >= tasks.length ? (
                      <button disabled>&gt;</button>
                    ) : (
                      <button>&gt;</button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={emptyBoxImage} alt="empty-box" width="300" height="200" />
            <p>
              You don't have any tasks, please make some tasks to be displayed
              here.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
