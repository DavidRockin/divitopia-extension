/**
 * Main currencies to display
 */
var mainCurrencies = ['USD','EUR', 'JPY', 'KRW', 'CAD','AUD','GBP','CNY','RUB'];

/**
 * Main cryptos to convert
 */
var mainCryptos = ['BTC', 'BCH', 'ETH', 'ETC', 'DIVX', 'LTC'];

/**
 * Currencies
 */
var availableCurrencies = [];

/**
 * JSON data of extension's web data for website selectors
 */
var webdata = null;

/**
 * Data
 */
var data = {};

/**
 * Default currencies
 */
var defaultCurrencies = mainCurrencies;

/**
 * Divitopia Website
 */
const divitopiaURL = 'https://divitopia.diviproject.org';

var currencySelectors = {};

/**
 * Fetch BTC prices
 *
 * We'll send an AJAX request to fetch recent Bitcoin
 * prices, it'll respond as a JSON object so we'll
 * have to parse it prior to using it
 */
function fetchPrices() {
	get(divitopiaURL + '/info/fiat', (json) => {
		data.fiat = json;
	});
	get(divitopiaURL + '/info/crypto', (json) => {
		data.crypto = json;
	});
}

/**
 * Sends an AJAX request with a callback
 *
 * @param {String} url
 * @param {Callable} callback
 * @todo  error handling !!!
 */
function get(url, callback) {
	// typical AJAX request
	var xhttp = new XMLHttpRequest();

	// our xhttp handler
	xhttp.onreadystatechange = function() {
		// only deal with valid responses
		if (this.readyState == 4 && this.status == 200) {
			callback(JSON.parse(this.responseText));
		}
	};

	// attempt to open and send the request
	xhttp.open("GET", url, true);
	xhttp.send();
}

/**
 * Fetch webdata JSON file
 */
function fetchWebdata() {
	get(getImage('/resources/web-data.json'), (json) => {
		webdata = json;
	});
}

/**
 * Fetches a website's selectors based on URL
 *
 * @param {String} url Active page URL
 * @return {null|String|boolean} If no webdata, null is returned.
 * 								 If there is no match, false is returned.
 * 								 If there is a match a string of selectors is returned
 */
function getSelectors(url) {
	var section = getWebdata(url);

	if (null === section)
		return false;

	return section.selectors.join(', ');
}

/**
 * Fetches a website's special triggers
 *
 * @param {String} url Active page URL
 * @return {null|String|boolean} If no webdata, null is returned.
 * 								 If there is no match, false is returned.
 * 								 If there is a match a string of selectors is returned
 */
function getSpecialTriggers(url) {
	var section = getWebdata(url);

	if (null === section || !section.specialTriggers)
		return false;

	var result = [];
	Object.keys(section.specialTriggers).forEach((func) => {
		result[func] = section.specialTriggers[func].join(', ');
	});
	return result;
}

/**
 * Return a website's alert trigger elements
 *
 * @param {String} url website URL
 * @return {Array|boolean}
 */
function getAlertTriggers(url) {
	var section = getWebdata(url);

	if (null === section || !section.alerts)
		return false;

	return section.alerts;
}

/**
 * Gets website specific data
 *
 * @param {String} url
 */
function getWebdata(url) {
	// if we have no webdata, return null, have to try again later
	if (null === webdata)
		return null;

	var sect;

	// loop through all config file sections
	for (var i = 0; i < webdata.length; ++i) {
		sect = webdata[i];

		// go through all URLs
		for (var j = 0; j < sect.urls.length; ++j) {
			// test the URL, if it matches return our selectors
			var regexp = new RegExp(sect.urls[j], "i");
			if (regexp.test(url))
				return sect;
		}
	}

	return null;
}

/**
 * Check to see if a specific element is being hovered
 *
 * @param  {Element} e
 * @return {boolean} True if the element is being hovered, false otherwise
 */
function isHover(e) {
	return (null !== e && e.parentElement && e.parentElement.querySelector(':hover') === e);
}

/**
 * Gets an extension file URL
 *
 * @param {String} url
 */
function getImage(url) {
	return getBrowser().extension.getURL(url);
}

/**
 * Calculate popup offset x position
 *
 * @param {Number} clientX X position of the cursor or target element
 * @param {Number} width   The width of the tooltip
 */
function calculateOffsetX(clientX, width) {
	// define the client's X position, add a margin
	var x = clientX + 30;

	return (
		// make sure the tooltip will remain on the screen
		x + width > window.innerWidth
		// it will go off, so move it to the left
		? x - width - 60
		// new position is fine as is
		: x

	// add the horizontal scroll distance to keep things proportional
	) + window.scrollX;
}

/**
 * Calculate popup offset y position
 *
 * @param {Number} clientY Y position of the cursor or target element
 * @param {Number} height  The height of the tooltip
 */
function calculateOffsetY(clientY, height) {
	// define the client's Y position
	var y = clientY + 10;

	return (
		// make sure the height of the tooltip does not go off screen
		y +height > window.innerHeight
		// it will go off, so move it upwards
		? y - height - 15
		// new position is fine as is
		: y

	// add the vertical distance scrolled
	) + window.scrollY;
}

/**
 * Get position of selected text
 *
 * @return {DOMRect|Object} Position of the selected text
 */
function getSelect() {
	// get the selected text
	var selection = window.getSelection();

	// ensure we have nothing selected
	if (selection.toString() == "") {
		// if so, return null coordinates, it'll be replaced automagically
		return {
			x : null,
			y : null,
		};
	}

	// return the DOMRect object
	return selection.getRangeAt(0).getBoundingClientRect();
}

/**
 * Get selection X position
 *
 * @return {Number|Null} If there is a selection, a number (in pixels) represent the X cord, null otherwise
 */
function getSelectX() {
	return getSelect().x;
}

/**
 * Get selection Y position
 *
 * @return {Number|Null} If there is a selection, a number (in pixels) represent the Y cord, null otherwise
 */
function getSelectY() {
	return getSelect().y;
}

/**
 * Get browser instance
 */
function getBrowser() {
	return (typeof browser === 'undefined' ? chrome : browser);
}

/**
 * Get extension runtime object
 */
function getRuntime() {
	return getBrowser().runtime;
}

/**
 * Get extension's version
 */
function getAppVersion() {
	return getRuntime().getManifest().version;
}

/**
 * Get extension homepage
 */
function getHomepage() {
	return getRuntime().getManifest().homepage_url;
}

/**
 * Update client currencies
 *
 * We'll send a message to the background services, asking for
 * recent prices and currencies. We'll then have to update them
 * locally so it can be used later on.
 *
 * This will allow the extension to have a central service
 * fetching prices, and providing to all tabs with the
 * extension active within them. We can also update them
 * periodically for live price conversion.
 *
 * @param {Function} callback
 */
function updateCurrencies(callback) {
	var callback = callback || (() => {});
	updateSettings(callback);

	// send message to fetch new prices
	getRuntime().sendMessage({
		action : 'get_data'
	}, (msg) => {
		// update our local variable to the response
		data = msg.data;
		callback('get_data', msg);
	});

	// send message to fetch new currencies
	getRuntime().sendMessage({
		action : 'get_currencies'
	}, (msg) => {
		// update our local available currencies
		availableCurrencies = msg.currencies;
		callback('get_currencies', msg);
	});
}

/**
 * Update our local data from our local storage
 *
 * We'll be saving user based currenices using local storage
 * so we'll have to periodically keep things up to date
 *
 * @param {Function} callback
 */
function updateSettings(callback) {
	var callback = callback || (() => {});

	getBrowser().storage.local.get("currencies", (i) => {
		mainCurrencies = i.currencies || defaultCurrencies;
		callback('update_currencies', i);
	});
}

/**
 * Gets the very first float in a string
 *
 * @param {String} str
 */
function getFirstFloat(str) {
	var regexp = str.match(/([0-9.,]+)/);
	if (null === regexp || null === regexp[0] || '' == regexp[0])
		return false;
	return parseFloat(regexp[0].replace(',', ''));
}

/**
 * Gets the price yield of a buy/sell
 *
 * @param {Float} current Current price
 * @param {Float} target Targeted price to sell/buy
 */
function getPriceYield(current, target) {
	return Math.abs(1 - target/current);
}

/**
 * Get's the website's default currency
 *
 * @param {String} url URL of the website
 */
function getWebsiteCurrency(url) {
	var data = getWebdata(url);

	if (null === data || !data.currency) {
		return 'BTC';
	}

	// should the currency data not be an object, return it
	if (typeof data.currency !== 'object') {
		return data.currency;
	}

	// use the method property to execute a custom function
	var fn = currencySelectors[data.currency.method];
	if (typeof fn === 'function') {
		return fn(data.currency);
	}

	return 'BTC';
}

/**
 * Gets currency data from a selector's attribute
 *
 * @param {Object} curr Currency detection details
 */
currencySelectors.selectorAttribute = (curr) => {
	var selector = curr.selector.split('|'),
		e = document.querySelector(selector[0]);
	if (null === e || null == (attr = e.getAttribute(selector[1]))) {
		return 'BTC';
	}
	return attr;
}

/**
 * Gets currency data from a selector's inner text
 *
 * @param {Object} curr Currency detection details
 */
currencySelectors.selectorText = (curr) => {
	try {
		var e = document.querySelectorAll(curr.selector)[0];
		if (null === e) {
			return 'BTC';
		}
		if(e.innerText.indexOf("/")!=-1){
			return e.innerText.split('/')[1].replace(/([/\\ ])+/, '');
		}else{
			return e.innerText.replace(/([/\\ ])+/, '');
		}
	} catch (ex) {
		return 'BTC';
	}
}
