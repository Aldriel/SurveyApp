'use strict';

// Configuring the Articles module
angular.module('answers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Answers', 'answers', 'dropdown', '/answers(/create)?');
		Menus.addSubMenuItem('topbar', 'answers', 'List Answers', 'answers');
		Menus.addSubMenuItem('topbar', 'answers', 'New Answer', 'answers/create');
	}
]);