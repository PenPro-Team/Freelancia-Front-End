import { Button, Card, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import RateStars from './../Components/RateStars';
import HeaderColoredText from "../Components/HeaderColoredText";

function FreelancerProfile(props) {
    const auth = getFromLocalStorage("auth");
    const user = auth ? auth.user : null;
    const history = useHistory();
  return (
    <>
    <HeaderColoredText text="Your Profile"/>

    {/* useEffect(() => {
        AxiosSkillsInstance.get("")
          .then((response) => {
            setSkillsOptions(response.data);
          })
          .catch((error) => {
            console.error("Error fetching skills:", error);
          });
      }, []); */}

    </>
    
  );
}

export default FreelancerProfile;
