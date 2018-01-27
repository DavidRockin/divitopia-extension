getBrowser().runtime.onInstalled.addListener((info) => {
	url = '/' + (info.reason === 'update' ? 'install-v' + getAppVersion() : 'install') + '.html';

	// we should only open a tab upon installation or update
	if (info.reason !== 'install' && info.reason !== 'update') {
		return;
	}

	getBrowser().tabs.create({
		url : divitopiaURL + url
	})

});