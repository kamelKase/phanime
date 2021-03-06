Meteor.publishComposite('userWithProfilePosts', function(username, limit) {
	return {
		find: function() {
			return Meteor.users.find({username: username}, {fields: requireCollectionFields.user.removeServices});
		},
		children: [
			{
				find: function(user) {
					return ProfilePosts.find({userId: user._id}, {sort: {createdAt: -1}, limit: limit});
				},
				children: [
					{
						// Publish the poster as well if it wasn't a status update
						find: function(profilePost, user) {
							if (profilePost.statusUpdate === false) {
								return Meteor.users.find({_id: profilePost.posterId}, {fields: requireCollectionFields.user.defaultFields});
							}
						}
					},
					{

						// Publish the profile post's comments
						find: function(profilePost, user) {

							return Comments.find({contentId: profilePost._id, type: 'profilePost'});

						},
						children : [
							{
								find: function(comment, profilePost, user) {
									// Publish users if it isn't published 
									if (comment.userId !== user._id && comment.userId !== profilePost.posterId) {
										return Meteor.users.find({_id: comment.userId}, {fields: requireCollectionFields.user.defaultFields});
									}
								}
							}

						]

					}

				]
			}
		]
	};

});