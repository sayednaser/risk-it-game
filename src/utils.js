const playerToClasses = function(player, mappingTemplate) {
    const mapping = {};
    Object.keys(mappingTemplate).forEach((key, index) => {
      mapping[key] = `${mappingTemplate[key]}-${player}`;
    });
  
    return mapping;
  };

export {playerToClasses}