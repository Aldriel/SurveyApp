'use strict';

// Configuring the Articles module
angular.module('answersets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Answersets', 'answersets', 'dropdown', '/answersets(/create)?');
		Menus.addSubMenuItem('topbar', 'answersets', 'List Answersets', 'answersets');
		Menus.addSubMenuItem('topbar', 'answersets', 'New Answerset', 'answersets/create');
	}
]);