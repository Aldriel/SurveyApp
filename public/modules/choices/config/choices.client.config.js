'use strict';

// Configuring the Articles module
angular.module('choices').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Choices', 'choices', 'dropdown', '/choices(/create)?');
		Menus.addSubMenuItem('topbar', 'choices', 'List Choices', 'choices');
		Menus.addSubMenuItem('topbar', 'choices', 'New Choice', 'choices/create');
	}
]);