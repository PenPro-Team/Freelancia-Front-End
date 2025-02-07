import logo from "./logo.svg";
import "./App.css";
import Home from "./Pages/Home";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Job_Details from "./Pages/Job_Details";

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <Home></Home>
    //   </header>
    // </div>
    // <div className="App">
    <div>
      {/* <header className="App-header"> */}
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} exact />
          {/* <Route path="/Freelancia-Front-End" component={Home} exact /> */}
          <Route path="/Freelancia-Front-End" component={Job_Details} exact />
          <Route
            path="/job_details/:project_id"
            component={Job_Details}
            exact
          />
          <Route path="*" component={Home} />
        </Switch>
      </BrowserRouter>
      {/* </header> */}
    </div>
  );
}

export default App;
