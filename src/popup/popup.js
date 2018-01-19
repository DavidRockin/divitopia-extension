function render() {

	var currencies = ['USD','AUD','BRL','CAD','CHF','CLP','CNY','DKK','EUR','GBP','HKD','INR','ISK','JPY','KRW','NZD','PLN','RUB','SEK','SGD','THB','TWD'],
		menu       = document.getElementById('menu')
	;

	/**
	 * Adds an item to the menu list
	 *
	 * @param {String} text The text of the menu item
	 * @param {Function} callback Callback when the user clicks the item
	 * @param {Function} onCreate Callback when the item has been created
	 */
	function addItem(text, callback, onCreate) {
		// create a list item element
		var l = document.createElement('li');

		// define the element's inner text
		l.innerText = text.toString();

		// if we have a callback, assign to the element
		if (null !== callback)
			l.addEventListener('mousedown', callback);

		// append the list item to the menu
		menu.appendChild(l);

		// if we have a creation callback, call it
		if (onCreate)
			onCreate(l);
	}

	/**
	 * Adds a separator to the menu list
	 *
	 * @param {Function} onCreate Callback when the separator has been created
	 */
	function addSeparator(onCreate) {
		// create a list item element
		var l = document.createElement('li');

		// add a separator class to the item
		l.classList.add('separator');

		// append the separator to the menu
		menu.appendChild(l);

		// if we have a creation callback, call it
		if (onCreate)
			onCreate(l);
	}

	/**
	 * Callback handler to handle conversion
	 *
	 * A main callback handler that will run execute a bit of
	 * code on the client to convert the selected currency
	 *
	 * @param {Element} e Element instance
	 */
	function handleConvert(e) {
		// get the selected currency
		var currency = e.target.getAttribute('data-currency');

		// check if this currency has been selected
		var index = mainCurrencies.indexOf(currency);

		// if this currency is selected, remove its active class
		if (index > -1) {
			e.target.classList.remove('active');
			mainCurrencies.splice(index, 1);

		// otherwise we need to being using this currency
		} else {
			e.target.classList.add('active');
			mainCurrencies.push(currency);
		}

		// change our currencies
		getRuntime().sendMessage({
			action         : 'set_currencies',
			mainCurrencies : mainCurrencies
		});

		// call our open selection tooltip function, pass our currency
		//getBrowser().tabs.executeScript({
		//	code : 'openSelectionTooltip(["' + currency + '"]);'
		//});
	}

	// add a label
	addItem('Display currencies:', null, (e) => {
		e.classList.add('disabled');
		e.classList.add('label');
	});

	// loop through our available currencies
	currencies.forEach((c) => {
		// add this currency as a menu item
		addItem(prices[c].name + ' (' + c + ')', handleConvert, (e) => {
			e.setAttribute('data-currency', c);
			if (mainCurrencies.indexOf(c) > -1)
				e.classList.add('active');
		});
	});

	// separate currencies from links
	addSeparator();

	// add a help link
	addItem('Help', (e) => {
		getBrowser().tabs.create({
			url : getHomepage()+ '/wiki'
		});
		window.close();
	});

	// add a homepage link
	addItem('The Divi Project', (e) => {
		getBrowser().tabs.create({
			url : 'https://www.diviproject.org/'
		});
		window.close();
	});

	// add a version indicator
	addItem('v ' + getAppVersion(), null, (e) => {
		e.classList.add('disabled');
	});

};

(function() {
	updateCurrencies((action, data) => {
		if (action == 'get_prices') {
			render();
		}
	});
})();