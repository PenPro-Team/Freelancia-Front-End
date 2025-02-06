
import './App.css';
import NavBar from './components/navbar';
import { BrowserRouter, Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import Home from './home';
import Footer from './components/footer';

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
