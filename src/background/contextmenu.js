(function() {

	// define browser's context menus
	var menu = getBrowser().contextMenus;


	mainCryptos.forEach((c) => {
		menu.create({
			id      : 'convert-selected-' + c.toLowerCase(),
			title   : 'Convert "%s" ' + c,
			contexts: ['selection']
		});
		menu.create({
			id      : 'convert-element-' + c.toLowerCase(),
			title   : 'Convert ' + c,
			contexts: ['link', 'editable']
		});
	});

	// create a context menu item for the active version
	menu.create({
		id       : 'version',
		title    : 'v' + getAppVersion(),
		enabled  : false,
		contexts : ['selection', 'link', 'editable']
	});

	// add an event listener to our menu
	menu.onClicked.addListener((info, tab) => {
		// make sure we have to convert selected text
		if (info.menuItemId.indexOf('convert-selected') !== 0 && info.menuItemId.indexOf('convert-element') !== 0)
			return;

		var crypto = info.menuItemId.substr(info.menuItemId.lastIndexOf('-') +1).toUpperCase();

		// execute the selection tooltip open function
		getBrowser().tabs.executeScript(tab.id, {
			code : 'openSelectionTooltip(null, "' + crypto + '");'
		});
	});

})();