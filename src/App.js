import logo from "./logo.svg";
import "./App.css";
import Home from "./Pages/Home";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginForm from "./Pages/login";
import RegisterForm from "./Pages/Register";
import NavBar from "./Components/Navbar";
import Footer from "./Components/Footer";
import JobDetails from "./Pages/JobDetails";
import JobList from "./Pages/JobList";
import Createjob from "./Components/CreateJob";
import { Container } from "react-bootstrap";
import unauthrizedpage from "./Pages/unauthrizedpage";
import ClientJobList from "./Components/ClientJobList";
import DesplayJobDetails from "./Pages/ClientJobs";
import page404 from "./Pages/page404";
import ClientJobs from "./Pages/ClientJobs";
import FreelancerProposals from "./Pages/FreelancerProposals";

function App() {
  return (
    <div className="bgControl" style={{}}>
      {/* <Container style={{ minHeight: "100vh", backgroundColor: "yellow" }}> */}
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/Freelancia-Front-End" component={Home} exact />
          <Route
            path="/Freelancia-Front-End/login"
            component={LoginForm}
            exact
          />
          <Route path="/login" component={LoginForm} exact />
          <Route
            path="/Freelancia-Front-End/register"
            component={RegisterForm}
            exact
          />
          <Route path="/register" component={RegisterForm} exact />
          <Route
            path="/Freelancia-Front-End/job_list"
            component={JobList}
            exact
          />
          <Route path="/job_list" component={JobList} exact />
          <Route path="/job_details/:project_id" component={JobDetails} exact />
          <Route
            path="/Freelancia-Front-End/job_details/:project_id"
            component={JobDetails}
            exact
          />
          <Route
            path="/Freelancia-Front-End/postjob"
            component={Createjob}
            exact
          />
          <Route
            path="/Freelancia-Front-End/clientjoblist"
            component={ClientJobs}
            exact
          />

          <Route
            path="/Freelancia-Front-End/proposals"
            component={FreelancerProposals}
            exact
          />

          {/* <Route path="/create-job" component={} exact /> */}
          <Route path="/403" component={unauthrizedpage} exact />
          <Route
            path="/Freelancia-Front-End/403"
            component={unauthrizedpage}
            exact
          />
          <Route path="/404" component={page404} exact />
          <Route path="/Freelancia-Front-End/404" component={page404} exact />
          <Route path="*" component={Home} />
        </Switch>

        <Footer />
      </BrowserRouter>
      {/* </Container> */}
    </div>
  );
}

export default App;
