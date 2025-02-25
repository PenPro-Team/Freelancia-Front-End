// import React, { useState } from "react";
// import { Button, Modal } from "react-bootstrap";
// import { AxiosProjectsInstance } from "../network/API/AxiosInstance";
// import { useHistory } from "react-router-dom";
// import { getFromLocalStorage } from "../network/local/LocalStorage";

// const JobActions = ({ job, onActionComplete }) => {
//   const history = useHistory();
//   const [submitting, setSubmitting] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [message, setMessage] = useState("");

//   // Constant to hide Update/Cancel buttons in this component to avoid duplication
//   const HIDE_UPDATE_CANCEL = true;

//   // Retrieve user data from localStorage
//   const user = getFromLocalStorage("auth");

//   // Function to change the job state
//   const changeJobState = async (newState) => {
//     try {
//       setSubmitting(true);
//       await AxiosProjectsInstance.patch(`/${job.id}`, { job_state: newState });
//       setMessage("Job state updated successfully");
//       if (onActionComplete) onActionComplete();
//     } catch (error) {
//       setMessage("Failed to update job state");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Permanently delete job
//   const deleteJobPermanently = async () => {
//     try {
//       setSubmitting(true);
//       await AxiosProjectsInstance.delete(`/${job.id}`);
//       setMessage("Job deleted permanently");
//       if (onActionComplete) onActionComplete();
//     } catch (error) {
//       setMessage("Failed to delete job");
//     } finally {
//       setSubmitting(false);
//       setShowDeleteModal(false);
//     }
//   };

//   // Function to handle cancel confirmation
//   const handleConfirmCancel = async (cancelType) => {
//     let newState = "";
//     if (cancelType === "full") {
//       newState = "canceled";
//     } else if (cancelType === "contract") {
//       newState = "contract canceled and reopened";
//     }
//     await changeJobState(newState);
//     setShowCancelModal(false);
//   };

//   // Function to render Update/Cancel buttons based on the job state
//   const renderButtons = () => {
//     // If the job state is finished or canceled: do not allow update or cancel
//     if (job.job_state === "finished" || job.job_state === "canceled") {
//       return null;
//     }

//     // If the job state is open
//     if (job.job_state === "open") {
//       if (HIDE_UPDATE_CANCEL) {
//         return null;
//       }
//       return (
//         <>
//           <Button
//             variant="primary"
//             onClick={() =>
//               history.push("/Freelancia-Front-End/postjob", {
//                 mode: "update",
//                 jobData: job,
//               })
//             }
//             disabled={submitting}
//           >
//             Update
//           </Button>
//           <Button
//             variant="danger"
//             onClick={() => setShowCancelModal(true)}
//             className="ml-2"
//             disabled={submitting}
//           >
//             Cancel
//           </Button>
//         </>
//       );
//     }

//     // If the job state is ongoing
//     if (job.job_state === "ongoing") {
//       if (HIDE_UPDATE_CANCEL) {
//         return null;
//       }
//       return (
//         <>
//           <Button
//             variant="danger"
//             onClick={() => setShowCancelModal(true)}
//             disabled={submitting}
//           >
//             Cancel
//           </Button>
//         </>
//       );
//     }

//     // If the job state is contract_cancelled
//     if (job.job_state === "contract_cancelled") {
//       if (HIDE_UPDATE_CANCEL) {
//         return null;
//       }
//       return (
//         <>
//           <Button
//             variant="primary"
//             onClick={() =>
//               history.push("/Freelancia-Front-End/postjob", {
//                 mode: "update",
//                 jobData: job,
//               })
//             }
//             disabled={submitting}
//           >
//             Update
//           </Button>
//           <Button
//             variant="danger"
//             onClick={() => setShowCancelModal(true)}
//             className="ml-2"
//             disabled={submitting}
//           >
//             Cancel
//           </Button>
//         </>
//       );
//     }

//     return null;
//   };

//   return (
//     <>
//       {/* if admin or super admin  */}
//       {/*
      
//         {user &&
//         user.user &&
//         (user.user.role === "admin" || user.user.role === "superadmin") && (
//           <Button
//             variant="warning"
//             onClick={() => {
//               setMessage("");
//               setShowDeleteModal(true);
//             }}
//             className="ml-2"
//             disabled={submitting}
//           >
//             Delete
//           </Button>
//         )}
      
//       */}
//       {renderButtons()}
//       {user && user.user && (
//         <Button
//           variant="warning"
//           onClick={() => {
//             setMessage("");
//             setShowDeleteModal(true);
//           }}
//           className="ml-2"
//           disabled={submitting}
//         >
//           Delete
//         </Button>
//       )}
//       {message && <div className="mt-2">{message}</div>}

//       {/* Updated Cancel Modal */}
//       <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Cancelation</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>
//             Do you want to end the job completely or do you want to only cancel the contract with this
//             client while keeping the job open ?
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
//             No
//           </Button>
//           <Button variant="danger" onClick={() => handleConfirmCancel("full")}>
//             End Job Completely
//           </Button>
//           <Button
//             variant="warning"
//             onClick={() => handleConfirmCancel("contract")}
//           >
//             Cancel Contract & Reopen Job
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Delete Modal as is */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to permanently delete this job?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             No
//           </Button>
//           <Button variant="danger" onClick={deleteJobPermanently}>
//             Yes, Delete Job
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default JobActions;
