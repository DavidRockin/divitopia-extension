/**
 * An object
 */
var prices         = null;

/**
 * Main currencies to display
 */
var mainCurrencies = ['USD','EUR', 'JPY', 'KRW', 'CAD','AUD','GBP','CNY','RUB'];

/**
 * Fetch BTC prices
 *
 * We'll send an AJAX request to fetch recent Bitcoin
 * prices, it'll respond as a JSON object so we'll
 * have to parse it prior to using it
 */
function fetchPrices() {
	// typical AJAX request
	var xhttp = new XMLHttpRequest();

	// our xhttp handler
	xhttp.onreadystatechange = function() {
		// only deal with valid responses
		if (this.readyState == 4 && this.status == 200) {
			// parse our response
			prices = JSON.parse(this.responseText);
			prices.RUB.symbol = ''; // just to clean up things a tad
		}
	};

	// attempt to open and send the request
	xhttp.open("GET", "https://blockchain.info/ticker?cors=true", true);
	xhttp.send();
}

/**
 * Check to see if a specific element is being hovered
 *
 * @param  {Element} e
 * @return {boolean} True if the element is being hovered, false otherwise
 */
function isHover(e) {
	return (e.parentElement.querySelector(':hover') === e);
}

/**
 * Gets an extension file URL
 *
 * @param {String} url
 */
function getImage(url) {
	if (typeof browser === 'undefined') {
		return chrome.extension.getURL(url);
	}
	return browser.extension.getURL(url);
}

/**
 * Calculate popup offset x position
 *
 * @param {Number} clientX X position of the cursor or target element
 * @param {Number} width   The width of the tooltip
 */
function calculateOffsetX(clientX, width) {
	// define the client's X position, add a margin
	var x = clientX + 15;

	return (
		// make sure the tooltip will remain on the screen
		x + width > window.innerWidth
		// it will go off, so move it to the left
		? x - width - 20
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
	var y = clientY + 6;

	return (
		// make sure the height of the tooltip does not go off screen
		y +height > window.innerHeight
		// it will go off, so move it upwards
		? y - height
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
 * Get extension's version
 */
function getAppVersion() {
	return getBrowser().runtime.getManifest().version;
}

/**
 * Get extension homepage
 */
function getHomepage() {
	return getBrowser().runtime.getManifest().homepage_url;
}
