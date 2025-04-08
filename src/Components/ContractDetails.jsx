import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosContractsInstance } from "../network/API/AxiosInstance";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import HeaderColoredText from "./HeaderColoredText";
import PersonalImg from "../assets/default-user.png";
import { FaExclamationTriangle } from "react-icons/fa";
import ReportContractModal from "./Admin-Panel/ReportContractModal";
import { useTranslation } from 'react-i18next';

const ContractDetails = () => {
  const { t } = useTranslation();
  const params = useParams();
  const contract_id = params.contract_id;
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const current_user = getFromLocalStorage("auth");
  const [showReportContractModal, setShowReportContractModal] = useState(false);
  const navigate = useNavigate();
  const fetchContractDetails = () => {
    if (!current_user || !current_user.user) {
      navigate("/Freelancia-Front-End/login");
      return;
    }
    setLoading(true);
    AxiosContractsInstance.get(`get/${contract_id}`, {
      headers: {
        Authorization: `Bearer ${current_user.user.access}`,
      },
    })
      .then((response) => {
        setContract(response.data);
        let contract = response.data;
        setLoading(false);
        if (
          contract.client_details.id !== current_user.user.user_id &&
          contract.freelancer_details.id !== current_user.user.user_id &&
          current_user.user.role !== "admin"
        ) {
          navigate("/Freelancia-Front-End/404", { replace: true });
        }
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchContractDetails();
  }, [contract_id]);

  const handleAcceptOrDeclineContract = (e) => {
    setLoading(true); // Show loading state

    // Determine the new contract state based on the button name
    let newState;
    switch (e.target.name) {
      case "Accept":
        newState = "Accepted";
        break;
      case "Decline":
        newState = "canceled";
        break;
      case "Complete":
        newState = "Completed";
        break;
      case "Cancel":
        newState = "canceled";
        break;
      default:
        newState = contract.contract_state;
    }
    console.log(`Contract ${e.target.name} button clicked`);
    console.log(`New contract state: ${newState}`);
    AxiosContractsInstance.patch(
      `update/${contract_id}`,

      {
        contract_state: newState,
      },
      {
        headers: {
          Authorization: `Bearer ${current_user.user.access}`,
        },
      }
    )
      .then(() => {
        console.log(`Contract ${e.target.name}ed successfully`);
        setContract((prevContract) => ({
          ...prevContract,
          contract_state: newState,
        }));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error updating contract:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  const handleSubmitWork = (e) => {
    e.preventDefault();

    // Get form values
    const description = e.target.workDescription.value.trim();
    const files = e.target.workFiles.files;

    // Validate that at least one field has a value
    if (description === "" && files.length === 0) {
      setValidationError(
        "Please provide either a description or upload files (or both)."
      );
      return;
    }

    // Clear any previous validation errors
    setValidationError("");

    setLoading(true); // Add loading state while submitting work
    const formData = new FormData();
    formData.append("description", description);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    AxiosContractsInstance.post(`${contract_id}/attachments`, formData, {
      headers: {
        Authorization: `Bearer ${current_user.user.access}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("Work submitted successfully:", response.data);
        e.target.reset();

        // Fetch the updated contract details to show the new submission
        fetchContractDetails();
      })
      .catch((error) => {
        console.error("Error submitting work:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  if (!contract)
    return (
      <div className="alert alert-warning m-3" role="alert">
        Contract not found
      </div>
    );

  return (
    <div className="container my-4">
      <HeaderColoredText text={t('contracts.details.title')} />
      <div className="card shadow ">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="mb-0">{t('contracts.details.title')}</h3>
          <span
            className={`badge ${
              contract.contract_state === "Accepted"
                ? "bg-success"
                : contract.contract_state === "pending"
                ? "bg-warning"
                : contract.contract_state === "Completed"
                ? "bg-info"
                : contract.contract_state === "canceled"
                ? "bg-danger"
                : "bg-secondary"
            }`}
          >
            {t(`contracts.status.${contract.contract_state}`)}
          </span>
        </div>

        <div className="card-body">
          {
            <div className="text-end">
              <button
                onClick={() => setShowReportContractModal(true)}
                className="btn btn-danger me-2"
              >
                <FaExclamationTriangle /> {t('report.contract')}
              </button>
            </div>
          }
          <div className="mb-4">
            <h4 className="card-title">{t('contracts.details.parties')}</h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{t('contracts.details.client')}</h5>
                    <div className="text-center mb-3">
                      <img
                        src={
                          contract.client_details.image
                            ? contract.client_details.image
                            : PersonalImg
                        }
                        alt={`${contract.client_details.first_name} ${contract.client_details.last_name}`}
                        className="rounded-circle"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <p className="card-text mb-1">
                      <strong>{t('contracts.details.name')}:</strong>{" "}
                      {contract.client_details.first_name}{" "}
                      {contract.client_details.last_name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{t('contracts.details.freelancer')}</h5>
                    <div className="text-center mb-3">
                      <img
                        src={
                          contract.freelancer_details.image
                            ? contract.freelancer_details.image
                            : PersonalImg
                        }
                        alt={`${contract.freelancer_details.first_name.charAt(
                          0
                        )} ${contract.freelancer_details.last_name.charAt(0)}`}
                        className="rounded-circle"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <p className="card-text mb-1">
                      <strong>{t('contracts.details.name')}:</strong>{" "}
                      {contract.freelancer_details.first_name}{" "}
                      {contract.freelancer_details.last_name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="card-title">{t('contracts.details.projectDetails')}</h4>
            <p>
              <strong>{t('contracts.details.projectState')}:</strong>{" "}
              {contract.project_details.project_state}
            </p>
            <p className="mb-1">
              <strong>{t('contracts.details.description')}:</strong>{" "}
              {contract.project_details.project_description}
            </p>
          </div>

          <div className="mb-4">
            <h4 className="card-title">{t('contracts.details.contractDetails')}</h4>
            <p className="mb-1">
              <strong>{t('contracts.details.createdAt')}:</strong>{" "}
              {new Date(contract.created_at).toLocaleDateString()}
            </p>

            <p className="mb-1">
              <strong>{t('contracts.details.budget')}:</strong> {contract.budget} $
            </p>
            <p className="mb-1">
              <strong>{t('contracts.details.deadline')}:</strong> {contract.deadline} {t('contracts.details.days')}
            </p>
          </div>

          <div>
            <h4 className="card-title">{t('contracts.details.termsAndConditions')}</h4>
            <div className="card">
              <div className="card-body">
                <p className="card-text">
                  {contract.contract_terms || t('contracts.details.noTermsSpecified')}
                </p>
              </div>
            </div>
          </div>

          {/* Work Submission Section */}
          {(contract.contract_state === 'Accepted' || contract.contract_state === 'Completed')  &&
            current_user.user.role === "freelancer" &&
            current_user.user.user_id === contract.freelancer_details.id && (
              <div className="mb-4 mt-5">
                <h4 className="card-title">{t('contracts.details.submitYourWork')}</h4>
                <div className="card">
                  <div className="card-body">
                    {validationError && (
                      <div className="alert alert-danger" role="alert">
                        {validationError}
                      </div>
                    )}
                    <form
                      onSubmit={handleSubmitWork}
                      className="needs-validation"
                    >
                      <div className="mb-3">
                        <label htmlFor="workDescription" className="form-label">
                          {t('contracts.details.description')}
                        </label>
                        <textarea
                          className="form-control"
                          id="workDescription"
                          name="workDescription"
                          rows="3"
                          placeholder={t('contracts.details.describeWork')}
                        ></textarea>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="workFiles" className="form-label">
                          {t('contracts.details.uploadFiles')}
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          id="workFiles"
                          name="workFiles"
                          multiple
                        />
                        <div className="form-text">
                          {t('contracts.details.selectMultipleFiles')}
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary">
                        {t('contracts.details.submitWork')}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

          {/* Work Submissions History */}
          {contract.contract_state === "Accepted" && (
            <div className="mb-4 mt-4">
              <h4 className="card-title">{t('contracts.details.workSubmissions')}</h4>
              <div className="card">
                <div className="card-body">
                  {contract.attachments &&
                  contract.attachments.files?.length > 0 ? (
                    <div className="list-group">
                      <div className="list-group-item">
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">{t('contracts.details.submission')}</h5>
                          <small className="text-muted">
                            {new Date(contract.created_at).toLocaleDateString()}
                          </small>
                        </div>
                        <p className="mb-1">
                          {contract.attachments.description}
                        </p>
                        <div className="mt-2">
                          {contract.attachments.files.map((file, index) => {
                            // Extract filename from URL
                            const fileName = file.split("/").pop();
                            // Get file extension to determine icon
                            const fileExt = fileName
                              .split(".")
                              .pop()
                              .toLowerCase();

                            let iconClass = "bi-file-earmark";
                            if (
                              ["jpg", "jpeg", "png", "gif", "svg"].includes(
                                fileExt
                              )
                            ) {
                              iconClass = "bi-file-earmark-image";
                            } else if (["pdf"].includes(fileExt)) {
                              iconClass = "bi-file-earmark-pdf";
                            } else if (
                              ["zip", "rar", "tar", "gz"].includes(fileExt)
                            ) {
                              iconClass = "bi-file-earmark-zip";
                            } else if (["doc", "docx"].includes(fileExt)) {
                              iconClass = "bi-file-earmark-word";
                            }

                            return (
                              <a
                                key={index}
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                              >
                                <span className="badge bg-light text-dark me-2 p-2 mb-2 d-inline-block">
                                  <i className={`bi ${iconClass} me-1`}></i>{" "}
                                  {fileName}
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">
                      {t('contracts.details.noWorkSubmitted')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contract Actions Section */}
          {contract.contract_state === 'pending' && ((current_user.user.role === "freelancer" && current_user.user.user_id === contract.client_details.id)||(current_user.user.role === "admin"))&& (
              <div className="d-flex justify-content-end mt-4">
                <button
                  name="Accept"
                  onClick={handleAcceptOrDeclineContract}
                  className="btn btn-success me-2"
                >
                  {t('contracts.details.actions.accept')}
                </button>
                <button
                  name="Decline"
                  onClick={handleAcceptOrDeclineContract}
                  className="btn btn-danger"
                >
                  {t('contracts.details.actions.decline')}
                </button>
              </div>
            )}
          {contract.contract_state === 'Accepted' && ((current_user.user.role === "client" && current_user.user.user_id === contract.client_details.id)||(current_user.user.role === "admin")) && (
              <div className="d-flex justify-content-end mt-4">
                {/* Complete button always available for client */}
                <button
                  name="Complete"
                  onClick={handleAcceptOrDeclineContract}
                  className="btn btn-success me-2"
                >
                  {t('contracts.details.actions.complete')}
                </button>

                {/* Calculate if deadline has passed */}
                {(() => {
                  const contractCreated = new Date(contract.created_at);
                  const deadlineDays = parseInt(contract.deadline, 10);
                  const deadlineDate = new Date(contractCreated);
                  deadlineDate.setDate(deadlineDate.getDate() + deadlineDays);
                  const currentDate = new Date();
                  const deadlinePassed = currentDate >= deadlineDate;

                  return (
                    <button
                      name="Cancel"
                      onClick={handleAcceptOrDeclineContract}
                      className="btn btn-danger"
                      disabled={current_user.user.role === "admin" ? false : !deadlinePassed}
                      title={
                        deadlinePassed
                          ? t('contracts.details.actions.cancel')
                          : t('contracts.details.actions.cannotCancel')
                      }
                    >
                      {t('contracts.details.actions.cancel')}
                    </button>
                  );
                })()}
              </div>
            )}
        </div>
      </div>
      <ReportContractModal
        show={showReportContractModal}
        onHide={() => setShowReportContractModal(false)}
        contractData={contract}
        onSuccess={() => {
          console.log("Contract report submitted successfully");
        }}
      />
    </div>
  );
};

export default ContractDetails;
