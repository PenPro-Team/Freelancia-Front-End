import "./App.css";
import Home from "./Pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./Pages/login";
import RegisterForm from "./Pages/Register";
import NavBar from "./Components/Navbar";
import Footer from "./Components/Footer";
import JobDetails from "./Pages/JobDetails";
import JobList from "./Pages/JobList";
import Createjob from "./Components/CreateJob";
import unauthrizedpage from "./Pages/unauthrizedpage";
import ClientJobs from "./Pages/ClientJobs";
import page404 from "./Pages/page404";
import FreelancerProposals from "./Pages/FreelancerProposals";
import FreelancerProfile from "./Pages/UpdateSkills";
import Dashboard from "./Pages/Dashboard";
import ProjectContract from "./Pages/Projectcontract";
import ClientContracts from "./Pages/ClientContracts";
import Chat from "./Pages/chat";
import ContractDetails from "./Components/ContractDetails";
import ChatRooms from "./Pages/ChatRooms";
import Chatbot from "./Components/Chatbot/Chatbot";
import AdminPanelLayout from "./Pages/AdminPanelLayout";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import PaymentSuccess from "./Components/wallet/PaymentSuccess";
import PaymentFailed from "./Components/wallet/PaymentFailed";
import NotFound from "./Pages/page404";
function App() {
  return (
    <div className="bgControl">
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/Freelancia-Front-End" element={<Home />} />
          <Route path="/Freelancia-Front-End/login" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/Freelancia-Front-End/register"
            element={<RegisterForm />}
          />
          <Route path="/paypal/success" element={<PaymentSuccess />} />
          <Route path="/paypal/cancel" element={<PaymentFailed />} />
          <Route path="/Freelancia-Front-End/about" element={<AboutUs />} />
          <Route path="/Freelancia-Front-End/contact" element={<ContactUs />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/Freelancia-Front-End/job_list" element={<JobList />} />
          <Route path="/job_list" element={<JobList />} />
          <Route path="/job_details/:project_id" element={<JobDetails />} />
          <Route
            path="/Freelancia-Front-End/job_details/:project_id"
            element={<JobDetails />}
          />
          <Route path="/Freelancia-Front-End/postjob" element={<Createjob />} />
          <Route
            path="/Freelancia-Front-End/clientjoblist"
            element={<ClientJobs />}
          />
          <Route path="/Dashboard/:id" element={<Dashboard />} />
          <Route
            path="/Freelancia-Front-End/proposals"
            element={<FreelancerProposals />}
          />
          <Route
            path="/Freelancia-Front-End/freelancerprofile"
            element={<FreelancerProfile />}
          />
          <Route
            path="/Freelancia-Front-End/contract"
            element={<ProjectContract />}
          />
          <Route
            path="/Freelancia-Front-End/clientContracts/:user_id"
            element={<ClientContracts />}
          />
          <Route
            path="/Freelancia-Front-End/contractDetails/:contract_id"
            element={<ContractDetails />}
          />
          <Route
            path="/Freelancia-Front-End/dashboard/:user_id"
            element={<Dashboard />}
          />
          <Route
            path="/Freelancia-Front-End/admin/"
            element={<AdminPanelLayout />}
          />
          {/* Under testing */}
          <Route path="/Freelancia-Front-End/chat" element={<Chat />} />
          <Route
            path="/Freelancia-Front-End/chatrooms"
            element={<ChatRooms />}
          />
          {/* Error Pages */}
          <Route path="/403" element={<unauthrizedpage />} />
          <Route
            path="/Freelancia-Front-End/403"
            element={<unauthrizedpage />}
          />
          <Route path="/404" element={<page404 />} />
          <Route path="/Freelancia-Front-End/404" element={<NotFound />} />

          {/* Catch-All Route */}
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <Chatbot />
    </div>
  );
}

export default App;
