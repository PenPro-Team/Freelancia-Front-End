
import './App.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import Home from './home';

import NavBar from './Components/NavBar';
import Footer from './Components/Footer';

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar/>
          <Switch>
            <Route path="/" component={Home} exact/>
            <Route/>
            <Route/>
          </Switch>
        <Footer/>
      </BrowserRouter>
    </>
  );
}

export default App;
