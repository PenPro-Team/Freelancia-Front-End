import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { AxiosProjectsInstance } from "../network/API/AxiosInstance";
import { useHistory } from "react-router-dom";
import { getFromLocalStorage } from "../network/local/LocalStorage";

const JobActions = ({ job, onActionComplete }) => {
  const history = useHistory();
  const [submitting, setSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState("");

  // ثابت لإخفاء أزرار Update/Cancel في هذا المكون لتجنب التكرار
  const HIDE_UPDATE_CANCEL = true;

  // جلب بيانات المستخدم من الـ localStorage
  const user = getFromLocalStorage("auth");

  // دالة لتغيير حالة الـ job
  const changeJobState = async (newState) => {
    try {
      setSubmitting(true);
      await AxiosProjectsInstance.patch(`/${job.id}`, { job_state: newState });
      setMessage("Job state updated successfully");
      if (onActionComplete) onActionComplete();
    } catch (error) {
      setMessage("Failed to update job state");
    } finally {
      setSubmitting(false);
    }
  };

  // permenant delete job
  const deleteJobPermanently = async () => {
    try {
      setSubmitting(true);
      await AxiosProjectsInstance.delete(`/${job.id}`);
      setMessage("Job deleted permanently");
      if (onActionComplete) onActionComplete();
    } catch (error) {
      setMessage("Failed to delete job");
    } finally {
      setSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  // دالة التعامل مع تأكيد الإلغاء
  const handleConfirmCancel = async () => {
    let newState = "";
    if (job.job_state === "open") {
      newState = "canceled";
    } else if (job.job_state === "ongoing") {
      // نفترض اختيار "canceled" للتبسيط
      newState = "canceled";
    } else if (job.job_state === "contract_cancelled") {
      // في حال إعادة الفتح، تُعتبر كأنها open
      newState = "open";
    }
    await changeJobState(newState);
    setShowCancelModal(false);
  };

  // دالة لإظهار أزرار Update/Cancel بناءً على حالة الـ job
  const renderButtons = () => {
    // إذا كانت الحالة finished أو canceled: لا يُسمح بالتحديث أو الإلغاء
    if (job.job_state === "finished" || job.job_state === "canceled") {
      return null;
    }

    // إذا كانت الحالة open
    if (job.job_state === "open") {
      if (HIDE_UPDATE_CANCEL) {
        return null;
      }
      return (
        <>
          <Button
            variant="primary"
            onClick={() =>
              history.push("/Freelancia-Front-End/postjob", {
                mode: "update",
                jobData: job,
              })
            }
            disabled={submitting}
          >
            Update
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowCancelModal(true)}
            className="ml-2"
            disabled={submitting}
          >
            Cancel
          </Button>
        </>
      );
    }

    // إذا كانت الحالة ongoing
    if (job.job_state === "ongoing") {
      if (HIDE_UPDATE_CANCEL) {
        return null;
      }
      return (
        <>
          <Button
            variant="danger"
            onClick={() => setShowCancelModal(true)}
            disabled={submitting}
          >
            Cancel
          </Button>
        </>
      );
    }

    // إذا كانت الحالة contract_cancelled
    if (job.job_state === "contract_cancelled") {
      if (HIDE_UPDATE_CANCEL) {
        return null;
      }
      return (
        <>
          <Button
            variant="primary"
            onClick={() =>
              history.push("/Freelancia-Front-End/postjob", {
                mode: "update",
                jobData: job,
              })
            }
            disabled={submitting}
          >
            Update
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowCancelModal(true)}
            className="ml-2"
            disabled={submitting}
          >
            Cancel
          </Button>
        </>
      );
    }

    return null;
  };

  return (
    <>
      {renderButtons()}
      {/* if admin or super admin  */}
      {/*

        {user &&
          user.user &&
          (user.user.role === "admin" || user.user.role === "superadmin") && (
            <Button
              variant="warning"
              onClick={() => {
                setMessage("");
                setShowDeleteModal(true);
              }}
              className="ml-2"
              disabled={submitting}
            >
              Delete
            </Button>
          )}

      */}
      {user && user.user && (
        <Button
          variant="warning"
          onClick={() => {
            setMessage("");
            setShowDeleteModal(true);
          }}
          className="ml-2"
          disabled={submitting}
        >
          Delete
        </Button>
      )}
      {message && <div className="mt-2">{message}</div>}

      {/* Modal cancel */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancelation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this job?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Yes, Cancel Job
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal delete */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete this job?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={deleteJobPermanently}>
            Yes, Delete Job
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default JobActions;
