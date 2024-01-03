import NavbarComponent from "../components/navbar";
import "../css/notFound.css";
import astronaut from "../images/astronaut.svg";
import notFound from "../images/404.svg";
import moon from "../images/moon.svg";
import earth from "../images/earth.svg";
import rocket from "../images/rocket.svg";
import { useNavigate, Link } from "react-router-dom";

export default function Notfound() {
  const navigate = useNavigate();
  return (
    <div className="bg-purple">
      <div className="stars">
        <NavbarComponent />
        <div className="central-body">
          <img
            className="image-404"
            alt="notFound"
            src={notFound}
            width="300px"
          />
          {/*IF YOU USE THIS THE PAGE WILL LOAD ON GOING BACK*/}
          {/* <Link className="btn-go-home" onClick={() => navigate(-1)}>
            GO BACK
          </Link> */}
        </div>
        <div className="objects">
          <img
            className="object_rocket"
            alt="rocket"
            src={rocket}
            width="40px"
          />
          <div className="earth-moon">
            <img
              className="object_earth"
              alt="earth"
              src={earth}
              width="100px"
            />
            <img className="object_moon" alt="moon" src={moon} width="80px" />
          </div>
          <div className="box_astronaut">
            <img
              className="object_astronaut"
              alt="astronaut"
              src={astronaut}
              width="140px"
            />
          </div>
        </div>
        <div className="glowing_stars">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>
      </div>
    </div>
  );
}
