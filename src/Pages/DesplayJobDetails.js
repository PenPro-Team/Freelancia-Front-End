
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import ClientJobList from "./ClientJobList";
import { useEffect } from "react";

function DesplayJobDetails() {
      const auth = getFromLocalStorage("auth");
    //   const user = auth ? auth.user : null;
    //   const isAuth = auth ? auth.isAuthenticated : null;
    const History = useHistory()
    useEffect(() => {
        if (!auth){
            History.push("/Freelancia-Front-End")
        }
        else{
            if(!auth.isAuthenticated){
                History.push("/Freelancia-Front-End")
            }else{
                if(!auth.user){
                    History.push("/Freelancia-Front-End")
                }else{
                    if(auth.user.role !== "client"){
                        History.push("/Freelancia-Front-End")
                    }
                }
            }
        }
        
    },[])
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
        {auth && auth.isAuthenticated && auth.user && auth.user.role === "client" ? (
            <ClientJobList userId={auth.user.id} />
          ) : (
            History.push("/unauthrizedpage")
          )} 
        
    </div>
  );
}

export default DesplayJobDetails;
