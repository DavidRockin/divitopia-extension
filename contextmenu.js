(function() {

	var menu = (typeof browser === 'undefined' ? chrome.contextMenus : browser.menus);
	var version = (typeof browser === 'undefined' ? chrome.runtime : browser.runtime).getManifest().version;

	menu.create({
		id      : 'convert-selected',
		title   : 'Convert "%s" BTC',
		contexts: ['selection'] //, 'link', 'editable']
	});

	menu.create({
		id       : 'version',
		title    : 'v' + version,
		enabled  : false,
		contexts : ['selection'] //, 'link', 'editable']
	});

	menu.onClicked.addListener((info, tab) => {
		if (info.menuItemId != 'convert-selected')
			return;
		alert(info.selectionText);
	});

})();