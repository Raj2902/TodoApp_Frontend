import { useState, useEffect } from "react";
import NavbarComponent from "../components/navbar";
import "../css/login.css";
import { useNavigate } from "react-router-dom";
import CreateTaskModal from "../modals/createTask";
import UpdateTaskModal from "../modals/updateTask";
import DeleteModal from "../modals/deleteTask";
import emptyBoxImage from "../../src/images/empty_box.png";
import Spinner from "react-bootstrap/Spinner";

export default function Dashboard() {
  const navigate = useNavigate();

  const [filterDate, setDate] = useState();
  const [pointer, setPointer] = useState({ start: 0, end: 4 });
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState([]);

  function handleStatus(event) {
    setTasks(
      totalTasks.filter((item) =>
        event.target.value === "all"
          ? item
          : item.completed ===
            (event.target.value === "not-done" ? false : true)
      )
    );
  }

  function checkTaskSuccess(check) {
    if (check) readAllTasks();
  }

  async function readAllTasks() {
    setIsLoading(true);
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
        setTotalTasks(result);
        //console.log(result);
      });
    setIsLoading(false);
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
      {isLoading && (
        <div style={{ textAlign: "center" }}>
          <Spinner animation="border" role="status"></Spinner>
          <span>Loading...</span>
        </div>
      )}
      <h1 style={{ textAlign: "center", marginTop: "2%", marginBottom: "2%" }}>
        Manage Your Tasks Here
      </h1>
      <div className="center-of-the-screen">
        {tasks.length > 0 ? (
          <>
            <p style={{ textAlign: "center" }}>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  textDecoration: "Bold",
                  marginRight: "20px",
                }}
              >
                Filter By Date:
                <input
                  type="date"
                  id="myDate"
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                  value={filterDate}
                  max={
                    new Date().getFullYear() +
                    "-" +
                    new Date().getMonth() +
                    1 +
                    "-" +
                    new Date().getDate()
                  }
                ></input>
              </span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  textDecoration: "Bold",
                }}
              >
                Filter By Completed:{" "}
                <label style={{ fontWeight: "normal" }} htmlFor="status">
                  Status:
                </label>
                <input
                  style={{ cursor: "pointer" }}
                  type="radio"
                  id="done"
                  name="status"
                  value="done"
                  onChange={handleStatus}
                />
                <label
                  style={{ cursor: "pointer", fontWeight: "normal" }}
                  htmlFor="done"
                >
                  Done
                </label>
                <input
                  style={{ cursor: "pointer" }}
                  type="radio"
                  id="not-done"
                  name="status"
                  value="not-done"
                  onChange={handleStatus}
                />
                <label
                  htmlFor="not-done"
                  style={{ cursor: "pointer", fontWeight: "normal" }}
                >
                  Not Done
                </label>
                <input
                  onChange={handleStatus}
                  style={{ cursor: "pointer" }}
                  type="radio"
                  id="all"
                  name="status"
                  value="all"
                />
                <label
                  htmlFor="all"
                  style={{ cursor: "pointer", fontWeight: "normal" }}
                >
                  All
                </label>
              </span>
            </p>
            <table>
              <tbody>
                <tr>
                  <th>S.No</th>
                  <th>Task</th>
                  <th>Description</th>
                  <th>Completed</th>
                  <th>Date</th>
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
                        {new Date(item.date).getDate() +
                          "/" +
                          (new Date(item.date).getMonth() + 1) +
                          "/" +
                          new Date(item.date).getFullYear()}
                      </td>
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
            <CreateTaskModal checkTaskSuccess={checkTaskSuccess} />
          </div>
        )}
      </div>
    </>
  );
}
