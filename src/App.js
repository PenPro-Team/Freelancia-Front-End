import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js"
import "../node_modules/react-popper/dist/index.umd.js"
import "react-popper"
import "./App.css";
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import "@fortawesome/fontawesome-free"
import JobList from "./Pages/JobList.jsx"


function App() {
  return (
    <div>
      <BrowserRouter>
      <Switch>
            <Route path="/" component={JobList} exact />
      </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
