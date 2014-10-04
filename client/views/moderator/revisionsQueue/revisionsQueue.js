Template.revisionsQueue.created = function() {

	this.currentContentFilter = new ReactiveVar('All');
};


Template.revisionsQueue.contentFilter = function(content) {

	var template = Template.instance();
	var currentContentFilter = template.currentContentFilter.get();

	return content === currentContentFilter ? 'active' : '';
	
};



Template.revisionsQueue.events({

	'click .contentFilter > button' : function(event, template) {
		template.currentContentFilter.set($(event.target).text());
	}

});