(function() {

	// timeout to update our prices (in seconds)
	var timeout = 60;

	// register a message receive handler
	getBrowser().runtime.onMessage.addListener((request, sender, response) => {
		// if action is to fetch currencies
		if (request.action == 'get_currencies') {
			// send back our available currencies
			response({
				currencies     : availableCurrencies,
				mainCurrencies : mainCurrencies || defaultCurrencies
			});

		// if action is to fetch our prices
		} else if (request.action == 'get_prices') {
			// send back our prices
			response({
				prices : prices
			});

		// if we're going to update the main currencies, update it
		} else if (request.action == "set_currencies") {
			mainCurrencies = request.mainCurrencies;
			getBrowser().storage.local.set({
				currencies : mainCurrencies
			});
		}
	});

	// force run fetch prices
	fetchPrices();

	// create a timer to periodically update extension-wide prices
	setInterval(fetchPrices, 1000 * timeout);

})();