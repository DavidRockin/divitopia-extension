(function() {

	var isFirefox = typeof browser !== 'undefined',
		base      = (isFirefox  ? browser : chrome),
		menu      = base.contextMenus
	;

	menu.create({
		id      : 'convert-selected',
		title   : 'Convert "%s" BTC',
		contexts: ['selection'] //, 'link', 'editable']
	});

	menu.create({
		id       : 'version',
		title    : 'v' + base.runtime.getManifest().version,
		enabled  : false,
		contexts : ['selection'] //, 'link', 'editable']
	});

	menu.onClicked.addListener((info, tab) => {
		if (info.menuItemId != 'convert-selected' || parseFloat(info.selectionText) != info.selectionText)
			return;
		base.tabs.executeScript(tab.id, {
			code : 'openTooltip(' + parseFloat(info.selectionText) + ', null, null, true);'
		});
	});

})();