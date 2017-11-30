(function() {

	// define browser's context menus
	var menu = getBrowser().contextMenus;

	// create a context menu link for selected text to be converted
	menu.create({
		id      : 'convert-selected',
		title   : 'Convert "%s" BTC',
		contexts: ['selection'] //, 'link', 'editable']
	});

	// create a context menu item for the active version
	menu.create({
		id       : 'version',
		title    : 'v' + getAppVersion(),
		enabled  : false,
		contexts : ['selection'] //, 'link', 'editable']
	});

	// add an event listener to our menu
	menu.onClicked.addListener((info, tab) => {
		// make sure we have to convert selected text and the text is a float
		if (info.menuItemId != 'convert-selected' || parseFloat(info.selectionText) != info.selectionText)
			return;

		// execute the selection tooltip open function
		getBrowser().tabs.executeScript(tab.id, {
			code : 'openSelectionTooltip();'
		});
	});

})();