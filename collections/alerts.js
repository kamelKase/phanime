Alerts = new Meteor.Collection('alerts');

AlertsSchema = new SimpleSchema({
	event: {
		type: String,
		allowedValues: [
			"userFollow",
			"userProfilePost",
			"revisionApproved",
			"revisionDeclined",
			"revisionReopened"
		]
	},
	userId: {
		type: String,
		custom: function() {
			// Check that a user from this ID actually exists
			if (!Meteor.users.findOne({_id: this.value})) {
				return "No user found with this userId";
			}
		},
		denyUpdate: true
	},
	properties: {
		type: Object,
		blackbox: true
	},
	read: {
		type: Boolean,
		defaultValue: false
	},
	createdAt: {
		type: Date,
		autoValue: function() {
			if (this.isInsert) {
				return new Date();
			} else if (this.isUpsert) {
				return {$setOnInsert: new Date()};
			} else {
				this.unset();
			}
		},
		denyUpdate: true,
		optional: true // this is only made optional because validation before insert will not work if it was required, however, this does not make much of a difference as the createdAt value will still be generated on insert.
	},
	updatedAt: {
		type: Date,
		autoValue: function() {
			if (this.isUpdate) {
				return new Date();
			}
		},
		denyInsert: true,
		optional: true // this is only made optional because validation before insert will not work if it was required, however, this does not make much of a difference as the value will still be generated on update.
	}

});

Alerts.attachSchema(AlertsSchema);


Alerts.allow({
	insert: function(userId, doc) {
		// We want the notifications to be send only through
		// a meteor method
		return false;
	},
	update: function(userId, doc, fields, modifier) {
		return userId === doc.userId
	}
});


Alerts.helpers({


	userFriendlyText: function() {
		
		var userFriendlyText;

		switch (this.event) {

			case "userFollow": 

				var followerProfileUrl = Router.routes['user'].path({username: this.properties.followerUsername.toLowerCase()});	
				userFriendlyText = "<span><a href='" + followerProfileUrl + "'>" + this.properties.followerUsername + "</a></span> started following you ";

				break;
			case "userProfilePost":

				var posterProfileUrl = Router.routes['user'].path({username: this.properties.posterUsername.toLowerCase()});
				var userProfileUrl = Router.routes['user'].path({username: Meteor.user().username});
				userFriendlyText = "<span><a href='" + posterProfileUrl + "'>" + this.properties.posterUsername + "</a></span> posted on <span><a href='" + userProfileUrl + "'>your profile</a></span> ";

				break;

			// Revisions
			case "revisionApproved":

				if (this.properties.contentType === 'Anime') {

					var decisionByProfileUrl = Router.routes['user'].path({username: this.properties.decisionByUsername.toLowerCase()});
					if (this.properties.revisionType === 'Addition') {
						var animeTitle = this.properties.animeTitle;
						userFriendlyText = '<span>Your revision for ' + animeTitle + ' was <b>approved</b> by <a href="' + decisionByProfileUrl + '">' + this.properties.decisionByUsername + "</a>";
					} else {
						var animeUrl = Router.routes['anime'].path({_id: this.properties.contentId, slug: 'placeholder'});
						userFriendlyText = '<span>Your revision for <a href="' + animeUrl + '"> this </a> anime was <b>approved</b> by <a href="' + decisionByProfileUrl + '">' + this.properties.decisionByUsername + "</a>";
					}

				}

				break;

			case "revisionDeclined":

				if (this.properties.contentType === 'Anime') {

					var decisionByProfileUrl = Router.routes['user'].path({username: this.properties.decisionByUsername.toLowerCase()});
					if (this.properties.revisionType === 'Addition') {
						var animeTitle = this.properties.animeTitle;
						userFriendlyText = '<span>Your revision for ' + animeTitle + ' was <b>declined</b> by <a href="' + decisionByProfileUrl + '">' + this.properties.decisionByUsername + "</a>";
					} else {
						var animeUrl = Router.routes['anime'].path({_id: this.properties.contentId, slug: 'placeholder'});
						userFriendlyText = '<span>Your revision for <a href="' + animeUrl + '"> this </a> anime was <b>declined</b> by <a href="' + decisionByProfileUrl + '">' + this.properties.decisionByUsername + "</a>";
					}

				}

				break;

			case "revisionReopened":

				if (this.properties.contentType === 'Anime') {

					var decisionByProfileUrl = Router.routes['user'].path({username: this.properties.decisionByUsername.toLowerCase()});
					if (this.properties.revisionType === 'Addition') {
						var animeTitle = this.properties.animeTitle;
						userFriendlyText = '<span>Your revision for ' + animeTitle + ' was <b>re-opened</b> by <a href="' + decisionByProfileUrl + '">' + this.properties.decisionByUsername + "</a>";
					} else {
						var animeUrl = Router.routes['anime'].path({_id: this.properties.contentId, slug: 'placeholder'});
						userFriendlyText = '<span>Your revision for <a href="' + animeUrl + '"> this </a> anime was <b>re-opened</b> by <a href="' + decisionByProfileUrl + '">' + this.properties.decisionByUsername + "</a>";
					}
				}

				break;

		}


		return userFriendlyText;

	}


});
