import { useState } from "react";
import Modal from "react-bootstrap/Modal";

function DeleteModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleDelete = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/task/delete/${props.id}`, {
      method: "DELETE",
      headers: {
        authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (!response.ok)
          throw new Error({ message: "Unable to delete the task." });
        return response.json();
      })
      .then((data) => {
        alert(data.message);
        props.checkTaskSuccess(true);
        handleClose();
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <button onClick={handleShow} style={{ backgroundColor: "red" }}>
        Delete
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are You sure you want to delte this task? This cant be undone!
        </Modal.Body>
        <Modal.Footer>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <button
              type="button"
              onClick={handleDelete}
              style={{
                backgroundColor: "blue",
                color: "white",
                width: "100px",
                padding: "10px 15px",
              }}
            >
              Confirm
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
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteModal;
