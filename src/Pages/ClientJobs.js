
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import ClientJobList from "../Components/ClientJobList";
import { useEffect } from "react";

function ClientJobs() {
      const auth = getFromLocalStorage("auth");
    //   const user = auth ? auth.user : null;
    //   const isAuth = auth ? auth.isAuthenticated : null;
    const History = useHistory()
    useEffect(() => {
        if (!auth){
            History.push("/Freelancia-Front-End/403")
        }
        else{
            if(!auth.isAuthenticated){
                History.push("/Freelancia-Front-End/403")
            }else{
                if(!auth.user){
                    History.push("/Freelancia-Front-End/403")
                }else{
                    if(auth.user.role !== "client"){
                        History.push("/Freelancia-Front-End/403")
                    }
                }
            }
        }
        
    },[])
  return (
    <div className="m-3">
        {auth && auth.isAuthenticated && auth.user && auth.user.role === "client" ? (
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
                <ClientJobList userId={auth.user.id} />
            </>
            
          ) : (
            
            History.push("/Freelancia-Front-End/403")
          )} 
        
    </div>
  );
}

export default ClientJobs;
