const playerToClasses = function(player, mappingTemplate) {
    const mapping = {};
    Object.keys(mappingTemplate).forEach((key, index) => {
      mapping[key] = `${mappingTemplate[key]}-${player}`;
    });
  
    return mapping;
  };

export {playerToClasses}


const playerToClasses2 = (player) => {
  switch (player) {
    case "1":
      return {
        cardAvatar: "card-avatar-1",
        cardAvatarImg: "card-avatar-img-1",
      };
    case "2":
      return {
        cardAvatar: "card-avatar-2",
        cardAvatarImg: "card-avatar-img-2",
      };
    default:
      console.log("Wrong player prop in Avatar.playerToClasses");
  }
};