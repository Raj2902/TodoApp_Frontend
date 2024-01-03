import { useState } from "react";
import Modal from "react-bootstrap/Modal";

function CreateTaskModal(props) {
  const [formData, setFormData] = useState({
    task_name: "",
    description: "",
    completed: false,
  });
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("Submitting Task", formData);
    if (formData) {
      await fetch(`${process.env.REACT_APP_API_URL}/task/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error({ message: "Unable to create a new task." });
          }
          return response.json();
        })
        .then(async (data) => {
          let result = await data;
          if (result) {
            alert(result.message);
            props.checkTaskSuccess(true);
            handleClose();
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  return (
    <>
      <button onClick={handleShow} style={{ backgroundColor: "green" }}>
        Create
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
            onSubmit={handleSubmit}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <label htmlFor="name" style={{ width: "120px" }}>
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="task_name"
                required
                style={{ width: "200px" }}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                  });
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <label htmlFor="description" style={{ width: "120px" }}>
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                required
                style={{ width: "200px" }}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                  });
                }}
              ></textarea>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="completed" style={{ width: "120px" }}>
                Completed:
              </label>
              <input
                type="checkbox"
                id="completed"
                name="completed"
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [event.target.name]: event.target.checked,
                  });
                }}
              />
            </div>
            <br />
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              <button
                type="submit"
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  width: "100px",
                  padding: "10px 15px",
                }}
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  backgroundColor: "#f5f5f5",
                  color: "black",
                  width: "100px",
                  padding: "10px 15px",
                }}
              >
                Close
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateTaskModal;
