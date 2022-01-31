import { XorShift } from "xorshift";

const playerToClasses = function (player, mappingTemplate) {
  const mapping = {};
  Object.keys(mappingTemplate).forEach((key, index) => {
    mapping[key] = `${mappingTemplate[key]}-${player}`;
  });

  return mapping;
};

const notPlayer = function (player) {
  return player === "1" ? "2" : "1";
};

export { playerToClasses, notPlayer };

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

export const capitalize = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const randomGenerator = function (seed) {
  function getRandomSeed() {
    return Math.random() * Math.pow(2, 32);
  }

  seed = seed || [
    getRandomSeed(),
    getRandomSeed(),
    getRandomSeed(),
    getRandomSeed(),
  ];
  const generator = new XorShift(seed);

  return {
    uniformInt: function (a, b) {
      return Math.floor(generator.random() * (b - a) + a);
    },
    random: function () {
      return generator.random();
    },
    uniformIntArray: function (a, b, length) {
      const array = [];
      for (let i = 0; i < length; i++) {
        array.push(this.uniformInt(a, b));
      }
      return array.sort((a, b) => b - a);
    },
  };
};
