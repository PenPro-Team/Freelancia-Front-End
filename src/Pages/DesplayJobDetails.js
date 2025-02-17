
import { getFromLocalStorage } from "../network/local/LocalStorage";
import ClientJobList from "./ClientJobList";

function DesplayJobDetails() {
      const auth = getFromLocalStorage("auth");
      const user = auth ? auth.user : null;
      const isAuth = auth ? auth.isAuthenticated : null;
  return (
    <div className="m-3">
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
        <ClientJobList userId={user.id} />
    </div>
  );
}

export default DesplayJobDetails;
