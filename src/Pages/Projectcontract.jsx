import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import HeaderColoredText from "../Components/HeaderColoredText";
import { AxiosContractsInstance } from "../network/API/AxiosInstance";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ProjectContract() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const proposal = location.state?.proposal;
  const [validated, setValidated] = useState(false);
  const [budgetError, setBudgetError] = useState("");
  const currentUser = getFromLocalStorage("auth");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    terms: proposal?.propose_text || "",
    deadline: proposal?.deadline || "",
    budget: proposal?.price || "",
    freelancer: proposal?.user?.name || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setBudgetError("");

    if (parseFloat(formData.budget) > parseFloat(currentUser.user.user_balance)) {
      setBudgetError(t("projectContract.budgetError"));
      e.stopPropagation();
      return;
    }

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      createContract();
    }

    setValidated(true);
  };

  const createContract = () => {
    setIsLoading(true);
    AxiosContractsInstance.post(
      "create",
      {
        contract_terms: formData.terms,
        deadline: formData.deadline,
        budget: formData.budget,
        freelancer: proposal.user.id,
        client: currentUser.user.user_id,
        project: proposal.project.id,
      },
      {
        headers: {
          Authorization: `Bearer ${currentUser.user.access}`,
        },
      }
    )
      .then((response) => {
        console.log(t("projectContract.success"));
        navigate(`/Freelancia-Front-End/clientContracts/${currentUser.user.user_id}`);
      })
      .catch((error) => {
        setError(error.response.data.message);
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "budget") {
      setBudgetError("");

      if (parseFloat(value) > parseFloat(currentUser.user.user_balance)) {
        setBudgetError(t("projectContract.budgetError"));
      }
    }

    setFormData({ ...formData, [id]: value });
  };

  if (!proposal) {
    return (
      <Container className="my-5 text-center">
        <h4 className="text-danger">{t("projectContract.noProposalError")}</h4>
        <p>{t("projectContract.noProposalMessage")}</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {error && <Alert variant="danger">{error}</Alert>}

      <HeaderColoredText text={t("projectContract.header")} />

      <Form noValidate validated={validated} onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-4">
          <Form.Label>
            {t("projectContract.terms")}<span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            id="terms"
            rows="4"
            placeholder={t("projectContract.termsPlaceholder")}
            value={formData.terms}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            {t("projectContract.termsError")}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>
            {t("projectContract.deadline")}<span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="number"
            id="deadline"
            min="1"
            placeholder={t("projectContract.deadlinePlaceholder")}
            value={formData.deadline}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            {t("projectContract.deadlineError")}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>
            {t("projectContract.budget")}<span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="number"
            id="budget"
            placeholder={t("projectContract.budgetPlaceholder")}
            min="0"
            step="0.01"
            value={formData.budget}
            onChange={handleChange}
            required
            isInvalid={!!budgetError || (validated && !formData.budget)}
          />
          <Form.Control.Feedback type="invalid">
            {budgetError || t("projectContract.budgetError")}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            {t("projectContract.availableBalance")}: ${currentUser.user.user_balance || 0}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>{t("projectContract.freelancer")}</Form.Label>
          <Form.Control
            type="text"
            id="freelancer"
            value={formData.freelancer}
            readOnly
          />
        </Form.Group >

        {isLoading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          
          <div >

          <div
            className="d-grid gap-2 mt-4"
            style={{
             
              [i18n.language === "ar" ? "left" : "right"]: "0",
            }}
          >
            <Button variant="primary" type="submit" size="lg">
              {t("projectContract.createButton")}
            </Button>
          </div>
          </div>
        )
        }

      </Form>
    </Container>
  );
}

export default ProjectContract;
