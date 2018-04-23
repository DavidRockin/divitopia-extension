/**
 * Divitopia Browser Scripts
 *
 * For now this will just open up a changelog on the main website for when the
 * extension gets installed for the first time or is updated.
 */

getBrowser().runtime.onInstalled.addListener(info => {

	// if a minor version, don't open tabs
	if (getAppVersion().split('.').length > 2) {
		return;
	}

	const url = divitopiaURL + '/install' + 
		(info.reason === 'update'
			? '-v' + getAppVersion() // an updated version
			: '' // first installation
		) + '.html'
	;

	// we should only open a tab upon installation or update
	if (info.reason !== 'install' && info.reason !== 'update') {
		return;
	}

	// this will open the tab
	getBrowser().tabs.create({ url })

})