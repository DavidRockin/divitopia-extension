/**
 * Instance of the active tooltip open
 */
var activeTooltip  = null;

/**
 * Array of all active tooltips
 */
var toolTips       = [];

/**
 * Triggered event to open the active tooltip
 */
var trigger        = null;

/**
 * Tooltip container ID
 */
var tooltipId      = 'divitopia-tooltip';

/**
 * Homepage URL
 */
var  diviURL       = 'https://www.diviproject.org/';

/**
 * Defined element selectors
 */
var	selectors     = [
	'tr.currencyData-tradepair td:nth-child(3)',
	'table#buyorders tbody tr td:nth-child(2)',
	'table#buyorders tbody tr td:nth-last-child(-n+2)',
	'table#sellorders tbody tr td:nth-child(2)',
	'table#sellorders tbody tr td:nth-last-child(-n+2)',
	'table#markethistory tbody tr.history-Sell td:nth-child(3)',
	'table#markethistory tbody tr.history-Sell td:nth-child(5)',
	'table#currencyData-BTC tbody tr td:nth-last-child(-n+5)',
	'#buyprice, #buyfee, #buytotal, #buynettotal, #sellprice, #sellfee, #selltotal, #sellnettotal',
	'.ticker-basevolume, .ticker-high, .ticker-low, .ticker-last'
].join(', ');

/**
 * Mouse position coordinates
 *
 * This will be used when we want to render a tooltip
 * at the user's cursor
 */
var mouseX = 0,
	mouseY = 0
;

/**
 * Remove the active tooltip
 */
function removeTooltip() {
	// remove our interval
	clearInterval(reset);
	reset = null;

	// loop through all open tooltips
	toolTips.forEach((e) => {
		// we will not be removing the tooltip if it is the active one
		// and is currently being hovered
		if (e === activeTooltip && isHover(trigger.target) || isHover(document.getElementById(tooltipId + '-popup')))
			return;

		// remove tooltip from the page
		e.remove();
	});
}

/**
 * Opens a tooltip at active selected text
 *
 * @param {Array} currency Currencies to only show
 */
function openSelectionTooltip(currency) {
	// get the selected text
	var selection = getSelect();

	// if we dont have an X and Y position, don't bother
	if (null === selection.x && null === selection.y)
		return;

	// parse the selected text, pass our information and open our tooltip!
	openTooltip(
		parseFloat(window.getSelection().toString()),
		selection.x,
		selection.y,
		true,
		currency
	);
}

/**
 * Opens the conversion tooltip on page
 *
 * @param {Float}   price Price to convert
 * @param {Number}  x the x position to display the tooltip
 * @param {Number}  y the y position to display the tooltip
 * @param {Boolean} forceOpen Force the tooltip to be active and open
 * @param {Array}   activeCurrencies An array of currencies to display
 */
function openTooltip(price, x, y, forceOpen, activeCurrencies) {
	// predefine some variables we'll need
	var tooltip    = document.createElement('div'),
		x          = x || mouseX,
		y          = y || mouseY
		forceOpen  = forceOpen || false,
		currencies = activeCurrencies || mainCurrencies
	;

	// check if we have a forced active tooltip, remove if it exists
	var active = document.getElementById(tooltipId + '-popup-active');
	if (null !== active) active.remove();

	// assign specific CSS styles to our new element, tooltip
	Object.assign(tooltip.style, {
		background    : '#dddd',
		color         : '#666',
		border        : '1px solid #999',

		position      : 'absolute',
		padding       : '9px 22px',
		'z-index'     : 99999999999,

		'text-align'  : 'center',
		'font-family' : '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
		'font-size'   : '12pt',

		visibility    : 'hidden',

		'-webkit-box-shadow' : '0 0 3px 3px rgba(69,69,69,0.42)',
		'box-shadow' : '0 0 3px 3px rgba(69,69,69,0.42)'
	});

	// define the ID to the tooltip
	tooltip.id = tooltipId + "-popup" + (forceOpen ? "-active" : "");

	// append the top logo and title to the tool tip
	tooltip.innerHTML = '<h2 style="font-size:11pt;margin-top:0px;padding-top:0px;">' +
							'<a href="' + diviURL + '" style="outline:0;text-decoration:none !important;border:0;color:#000" target="_blank">' +
								'<img src="' + getImage('resources/icon-divi.svg') +
									'" style="height:9.5pt;max-width:auto;margin-top:-3px;" /> The Divi Project' +
						'</a></h2>';

	// loop through our acceptable currencies,
	currencies.forEach((c) => {
		// append currency to tooltip
		tooltip.innerHTML += '<b>' + c + '</b>: ' +
								prices[c].symbol + ' ' +
								(price * prices[c].last).toFixed(3) +
							'<br />'
		;
	});

	// append tooltip motto
	tooltip.innerHTML += '<h4 style="font-size:10pt;font-weight:bold;color:#333">Crypto Made Easy</h4>';

	// if the tooltip is to be forced open, add a custom tooltip event listener
	if (forceOpen) {
		tooltip.addEventListener("mouseleave", (e) => {
			// remove this target if the mouse leaves the tooltip
			e.target.remove();
		});
	}

	// append the tooltip to the body!
	document.body.appendChild(tooltip);

	// calculate and assign tooltip top and left offsets
	tooltip.style.top  = calculateOffsetY(y, tooltip.getBoundingClientRect().height) + 'px';
	tooltip.style.left = calculateOffsetX(x, tooltip.getBoundingClientRect().width)  + 'px';

	// make the tooltip visible
	tooltip.style.visibility = '';

	if (!forceOpen) {
		toolTips.push(tooltip);
	}
	activeTooltip = tooltip;
}

/**
 * Trigger tooltip from an element
 *
 * @param {Element} e Element that triggered the tooltip
 */
function showTooltip(e) {
	trigger = e;

	// open a tooltip, pass along the element's text as the price
	// and the client's cursor position
	openTooltip(
		parseFloat(e.target.value || e.target.innerText),
		e.clientX,
		e.clientY
	);
}

(function() {
	// fetch out prices
	fetchPrices();

	// create a global mouse enter event listener
	document.addEventListener('mouseenter', (e) => {
		// if this element does not contain our tooltip's class, ignore it
		if (!e.target.classList.contains(tooltipId))
			return;

		// let's open the tooltip from this element
		showTooltip(e);
	}, true);

	// create a global mouse out event listener
	document.addEventListener('mouseout', (e) => {
		// in 50ms attempt to remove any open tooltips
		reset = setTimeout(removeTooltip, 50);
	}, true);

	// create a global mouse move event listener
	document.addEventListener('mousemove', (e) => {
		// update our mouse positions
		mouseX = e.pageX;
		mouseY = e.pageY;
	});

	// create an interval function every 1s
	setInterval(() => {
		try {
			// remove any tooltips
			removeTooltip();
		} catch (ex) {
		}

		// find all elements matching our selectors
		document.querySelectorAll(selectors).forEach((e) => {
			// ensure this element has not been marked yet
			if (e.classList.contains(tooltipId))
				return;

			// add the class to the element
			e.classList.add(tooltipId);
		});
	}, 1000, 100);

})();