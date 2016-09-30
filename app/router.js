function router(){

	var ApplicationRouter = Backbone.Router.extend({

		//map url routes to contained methods
		routes: {
			"": "work",
			"work": "work",
			"about": "about",
			"resume": "resume",
			"contact": "contact"
		},

		deselectPills: function(){
			//deselect all navigation pills
			$('ul.pills li').removeClass('active');
		},

		selectPill: function(pill){
			//deselect all navigation pills
			this.deselectPills();
			//select passed navigation pill by selector
			$(pill).addClass('active');
		},

		hidePages: function(){
			//hide all pages with 'pages' class
			$('div.pages').hide();
		},

		showPage: function(page){
			//hide all pages
			this.hidePages();
			//show passed page by selector
			$(page).show();
		},
		work: function() {
			this.showPage('div#work-page');
			this.selectPill('li.work-pill');
		},
		about: function() {
			this.showPage('div#about-page');
			this.selectPill('li.about-pill');
		},
		resume: function() {
			this.showPage('div#resume-page');
			this.selectPill('li.resume-pill');
		},
		contact: function() {
			this.showPage('div#contact-page');
			this.selectPill('li.contact-pill');
		}
	});

	var ApplicationView = Backbone.View.extend({

		//bind view to body element (all views should be bound to DOM elements)
		el: $('body'),

		//observe navigation click events and map to contained methods
		events: {
			'click ul.pills li.work-pill a': 'displayWork',
			'click ul.pills li.about-pill a': 'displayAbout',
			'click ul.pills li.resume-pill a': 'displayResume',
			'click ul.pills li.contact-pill a': 'displayContact'
		},

		//called on instantiation
		initialize: function(){
			//set dependency on ApplicationRouter
			this.router = new ApplicationRouter();

			//call to begin monitoring uri and route changes
			Backbone.history.start();
		},
		displayWork: function(){
			this.router.navigate("work", true);
		},
		displayAbout: function(){
			this.router.navigate("about", true);
		},
		displayResume: function(){
			this.router.navigate("resume", true);
		},
		displayContact: function(){
			this.router.navigate("contact", true);
		}
	});

	//load application
	new ApplicationView();

}
