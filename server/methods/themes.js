Meteor.methods({
  getThemes: function() {
    return Themes.find({}, {sort: {name: 1}}).fetch();
  },
  addThemes : function() {
      var themes = [
        "Cars",
        "Demons",
        "Drama",
        "Ecchi",
        "Game",
        "Harem",
        "Homosexual",
        "Magic",
        "Magical",
        "Martial Arts",
        "Mecha",
        "Military",
        "Music",
        "Parody",
        "Pastiche",
        "Samurai",
        "Satire",
        "School Life",
        "Space",
        "Sports",
        "Super Power",
        "Supernatural",
        "Swordplay",
        "Vampire"
      ];

      themes.forEach(function(name) {
        Themes.insert({name: name});
      });
  }
})
