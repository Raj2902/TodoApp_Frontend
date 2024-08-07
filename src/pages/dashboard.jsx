import { useState, useEffect } from "react";
import NavbarComponent from "../components/navbar";
import "../css/login.css";
import { useNavigate } from "react-router-dom";
import CreateTaskModal from "../modals/createTask";
import UpdateTaskModal from "../modals/updateTask";
import DeleteModal from "../modals/deleteTask";
import emptyBoxImage from "../../src/images/empty_box.png";
import Spinner from "react-bootstrap/Spinner";
import "../css/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [filterDate, setDate] = useState();
  const [pointer, setPointer] = useState({ start: 0, end: 4 });
  const [pointerMob, setPointerMob] = useState({ start: 0, end: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState([]);
  const [filter, setFilter] = useState("all");

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
    if (check) {
      readAllTasks();
      document.getElementById("all").click();
    }
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
  function handleNextMob() {
    console.log("Next");
    console.log("start::", pointerMob.start, "end::", pointerMob.end);
    setPointerMob({ start: pointerMob.start + 1, end: pointerMob.end + 1 });
  }
  function handlePrevMob() {
    console.log("Prev");
    console.log("start::", pointerMob.start, "end::", pointerMob.end);
    setPointerMob({ start: pointerMob.start - 1, end: pointerMob.end - 1 });
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
    } else {
      readAllTasks();
      document.getElementById("all").click();
    }
  }, [navigate]);
  return (
    <>
      <NavbarComponent />
      {isLoading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spinner animation="border" role="status"></Spinner>
          <span>Loading...</span>
        </div>
      )}
      <h1 style={{ textAlign: "center", margin: "30px", fontSize: "30px" }}>
        Manage Your Tasks Here
      </h1>
      <div className="center-of-the-screen">
        <p>
          <span>
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
          <span>
            Filter By Completed:{" "}
            <form action="#" style={{ display: "inline-flex", gap: "5px" }}>
              <label style={{ fontWeight: "normal" }} htmlFor="status">
                Status:
              </label>
              <input
                style={{ cursor: "pointer" }}
                type="radio"
                id="done"
                name="status"
                value="done"
                onChange={(event) => {
                  setFilter("done");
                  handleStatus(event);
                }}
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
                onChange={(event) => {
                  setFilter("not-done");
                  handleStatus(event);
                }}
              />
              <label
                htmlFor="not-done"
                style={{ cursor: "pointer", fontWeight: "normal" }}
              >
                not-done
              </label>
              <input
                onChange={(event) => {
                  setFilter("all");
                  handleStatus(event);
                }}
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
            </form>
          </span>
        </p>
        {tasks.length > 0 ? (
          <>
            <table className="desktopTable">
              <thead>Total Tasks : {tasks.length}</thead>
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
                        <div style={{ display: "flex", gap: "10px" }}>
                          <UpdateTaskModal
                            id={item._id}
                            checkTaskSuccess={checkTaskSuccess}
                          />
                          <DeleteModal
                            id={item._id}
                            checkTaskSuccess={checkTaskSuccess}
                          />
                        </div>
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
            <table className="mobileTable">
              <thead>Total Tasks : {tasks.length}</thead>
              <tbody>
                {tasks
                  .slice(pointerMob.start, pointerMob.end + 1)
                  .map((item, index) => (
                    <tr key={item._id}>
                      <td>
                        <b>S No : </b>
                        {index + pointerMob.start + 1}
                      </td>
                      <td>
                        <b>Task Name : </b>
                        {item.task_name}
                      </td>
                      <td>
                        <b>Task Description : </b>
                        {item.description}
                      </td>
                      <td>
                        <b>Task Completed : </b>
                        {item.completed ? "Yes" : "No"}
                      </td>
                      <td>
                        <b>Task Date : </b>
                        {new Date(item.date).getDate() +
                          "/" +
                          (new Date(item.date).getMonth() + 1) +
                          "/" +
                          new Date(item.date).getFullYear()}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <CreateTaskModal
                            checkTaskSuccess={checkTaskSuccess}
                          />
                          <UpdateTaskModal
                            id={item._id}
                            checkTaskSuccess={checkTaskSuccess}
                          />
                          <DeleteModal
                            id={item._id}
                            checkTaskSuccess={checkTaskSuccess}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    onClick={handlePrevMob}
                    style={{ float: "left" }}
                    className="removeBorder"
                  >
                    {pointerMob.start === 0 ? (
                      <button disabled>&lt;</button>
                    ) : (
                      <button>&lt;</button>
                    )}
                  </td>
                  <td
                    onClick={handleNextMob}
                    style={{ float: "right" }}
                    className="removeBorder"
                  >
                    {pointerMob.end + 1 >= tasks.length ? (
                      <button disabled>&gt;</button>
                    ) : (
                      <button>&gt;</button>
                    )}
                  </td>
                </tr>
              </tfoot>
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
              {filter === "done"
                ? "You don't have any tasks completed please complete some tasks first."
                : filter === "not-done"
                ? "You have all the tasks completed."
                : "You have'nt created any task till yet."}
            </p>
            <CreateTaskModal checkTaskSuccess={checkTaskSuccess} />
          </div>
        )}
      </div>
    </>
  );
}
