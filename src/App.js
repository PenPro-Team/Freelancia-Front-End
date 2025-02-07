import logo from "./logo.svg";
import "./App.css";
import Home from "./Pages/Home";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginForm from "./Pages/login";
import RegisterForm from "./Pages/Register";
import NavBar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Job_Details from "./Pages/Job_Details";
import JobList from "./Pages/JobList";

function App() {
  return (
    <div className="">
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
          <Route
            path="/job_details/:project_id"
            component={Job_Details}
            exact
          />
          <Route
            path="/Freelancia-Front-End/job_details/:project_id"
            component={Job_Details}
            exact
          />

          <Route path="*" component={Home} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
