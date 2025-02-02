import logo from "./logo.svg";
import "./App.css";
import Home from "./Pages/Home";
import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <Home></Home>
    //   </header>
    // </div>
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/Freelancia" component={Home} exact />
            <Route path="*" component={Home} />
          </Switch>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
