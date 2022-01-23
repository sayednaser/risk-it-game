import "../css/components/Avatar.css";

const playerToClasses = (player, mappingTemplate) => {
  const mapping = {};
  Object.keys(mappingTemplate).forEach((key, index) => {
    mapping[key] = `${mappingTemplate[key]}-${player}`;
  });

  return mapping;
};

const Avatar = (props) => {
  const { player } = props;
  const classes = playerToClasses(player, {
    cardAvatar: "card-avatar",
    cardAvatarImg: "card-avatar-img",
  });

  return (
    <div className={`card-avatar ${classes.cardAvatar}`}>
      <img
        className={`card-avatar-img ${classes.cardAvatarImg}`}
        src="assets/avatar1.jpg"
      />
    </div>
  );
};

export default Avatar;
