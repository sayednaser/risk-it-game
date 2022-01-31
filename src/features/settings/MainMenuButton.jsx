import Button from '../../common/Button'
import { gameTypeSet } from "./settingsSlice";
import { useDispatch } from "react-redux";
import classNames from 'classnames';


const roleToTextMapping = {
  singlePlayer: "Single Player",
  twoPlayer: "Two Players",
  multiPlayer: "Multiplayer",
};

const MainMenuButton = (props) => {
  const { text, className } = props;
  const dispatch = useDispatch();

  // const handleClick = (e) => dispatch(gameTypeSet(role))



  return <Button className={classNames("btn btn-main", className)} text={text}/>;
};

export default MainMenuButton;
