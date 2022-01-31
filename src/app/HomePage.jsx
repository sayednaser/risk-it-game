import { Link } from "react-router-dom";
import Heading from "../common/Heading";
import MainMenuButton from "../features/settings/MainMenuButton";
import "./HomePage.css";

const MainMenuPage = (props) => {
  return (
    <main className="home-page">
      <Heading className="heading-main" text="RISK it" />
      <section className="main-menu">
        <Link to="/game">
          <MainMenuButton text="Play" />
        </Link>
        <Link className="btn-about" to="/about">
          <MainMenuButton text="About" />
        </Link>
      </section>
    </main>
  );
};

export default MainMenuPage;
