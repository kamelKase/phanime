AnimeController = RouteController.extend({
	
	onAfterAction: function () {
	
		if (this.ready()) {
			var anime = this.data();

			SEO.set({
				title: siteSettings.getFullTitle(anime.canonicalTitle),
				meta: {
					'description' : anime.description
				},
				og: {
					'title' : siteSettings.getFullTitle(anime.canonicalTitle),
					'description' : anime.description,
					'type' : 'video.tv_show',
					'image' : anime.coverImageUrl(),
					'video:release_date' : anime.startDate
				}
			});
		}
	},

	waitOn: function () {
		return Meteor.subscribe('anime', this.params._id);
	},

	data: function () {
		var anime = Anime.findOne({_id: this.params._id});


		// Add episodes once the subscription is ready
		if (this.ready()) {
			if (anime) {
				anime.episodes = Episodes.find({animeId: anime._id}, {sort: {episodeNumber: 1}});
				anime.castings = Castings.find({animeId: anime._id});
				anime.staffMembers = StaffMembers.find({animeId: anime._id});
				anime.libraryEntry = LibraryEntries.findOne({animeId: anime._id});
				anime.reviews = Reviews.find({animeId: anime._id});		
				return anime;
			} else {
				this.render('fourOhFour');
			}
		}

	}

});