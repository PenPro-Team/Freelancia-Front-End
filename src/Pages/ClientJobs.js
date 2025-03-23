import { useNavigate } from "react-router-dom";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import ClientJobList from "../Components/ClientJobList";
import { useEffect } from "react";

function ClientJobs() {
  const auth = getFromLocalStorage("auth");
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate("/Freelancia-Front-End/403");
    } else {
      if (!auth.isAuthenticated) {
        navigate("/Freelancia-Front-End/403");
      } else {
        if (!auth.user) {
          navigate("/Freelancia-Front-End/403");
        } else {
          if (auth.user.role !== "client") {
            navigate("/Freelancia-Front-End/403");
          }
        }
      }
    }
  }, [auth, navigate]);

  return (
    <div className="m-3">
      {auth &&
      auth.isAuthenticated &&
      auth.user &&
      auth.user.role === "client" ? (
        <>
          <p
            className="text-center fs-1 fw-bold display-3 mb-3"
            style={{
              background: "linear-gradient(90deg, #007bff, #6610f2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Job Lists
          </p>
          <ClientJobList userId={auth.user.user_id} />
        </>
      ) : (
        navigate("/Freelancia-Front-End/403")
      )}
    </div>
  );
}

export default ClientJobs;
