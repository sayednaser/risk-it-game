import Button from "../../common/Button";
import classNames from "classnames";

const roleToTextMapping = {
  singlePlayer: "Single Player",
  twoPlayer: "Two Players",
  multiPlayer: "Multiplayer",
};

const MainMenuButton = (props) => {
  const { text, className } = props;

  return (
    <Button className={classNames("btn btn-main", className)} text={text} />
  );
};

export default MainMenuButton;
