function router(){

	var ApplicationRouter = Backbone.Router.extend({

		//map url routes to contained methods
		routes: {
			"": "matrix",
			"bookmarks": "bookmarks",
			"life": "life",
			"about": "about",
			"contact": "contact",
			"map": "map",
			"pie": "pie",
			"matrix": "matrix",
			"timeline": "timeline"
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

		bookmarks: function() {
			this.showPage('div#bookmarks-page');
			this.selectPill('li.bookmarks-pill');
		},
		life: function() {
			this.showPage('div#life-page');
			this.selectPill('li.life-pill');
		},
		about: function() {
			this.showPage('div#about-page');
			this.selectPill('li.about-pill');
		},

		contact: function() {
			this.showPage('div#contact-page');
			this.selectPill('li.contact-pill');
		},
		map: function() {
			this.showPage('div#map-page');
			this.selectPill('li.map-pill');
		},
		pie: function() {
			this.showPage('div#pie-page');
			this.selectPill('li.pie-pill');
		},
		matrix: function() {
			this.showPage('div#matrix-page');
			this.selectPill('li.matrix-pill');
		},
		timeline: function() {
			this.showPage('div#timeline-page');
			this.selectPill('li.timeline-pill');
		}
	});

	var ApplicationView = Backbone.View.extend({

		//bind view to body element (all views should be bound to DOM elements)
		el: $('body'),

		//observe navigation click events and map to contained methods
		events: {
			'click ul.pills li.bookmarks-pill a': 'displayBookmarks',
			'click ul.pills li.life-pill a': 'displayLife',
			'click ul.pills li.about-pill a': 'displayAbout',
			'click ul.pills li.contact-pill a': 'displayContact',
			'click ul.pills li.map-pill a': 'displayMap',
			'click ul.pills li.pie-pill a': 'displayPie',
			'click ul.pills li.matrix-pill a': 'displayMatrix',
			'click ul.pills li.timeline-pill a': 'displayTimeline'
		},

		//called on instantiation
		initialize: function(){
			//set dependency on ApplicationRouter
			this.router = new ApplicationRouter();

			//call to begin monitoring uri and route changes
			Backbone.history.start();
		},

		displayBookmarks: function(){
			this.router.navigate("bookmarks", true);
		},
		displayLife: function(){
			this.router.navigate("life", true);
		},
		displayAbout: function(){
			this.router.navigate("about", true);
		},
		displayContact: function(){
			this.router.navigate("contact", true);
		},
		displayMap: function(){
			this.router.navigate("map", true);
		},
		displayPie: function(){
			this.router.navigate("pie", true);
		},
		displayMatrix: function(){
			this.router.navigate("matrix", true);
		},
		displayTimeline: function(){
			this.router.navigate("timeline", true);
		}
	});

	//load application
	new ApplicationView();

}
