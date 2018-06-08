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
 * Alert triggerable ID
 */
var triggerId      = 'divitopia-alert';

/**
 * Homepage URL
 */
var  diviURL       = 'https://www.diviproject.org/';

/**
 * Defined element selectors
 */
var	selectors     = null;

/**
 * Defined element special triggers
 */
var specialTriggers = null;

/**
 * Defined alert triggers
 */
var alerts = null;

/**
 * Current price of the currency
 */
var price = 0.0;

/**
 * % to alert for loss
 */
const alert_threshold = 0.15;

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
 * Lock tooltips being opened
 *
 * This will prevent any elements opening the tooltip, if a tooltip
 * has already been opened from a context menu. It can only be reset
 * if the user moves the cursor.
 *
 * When a context menu is used to convert a price, the moment it disappears
 * and if the cursor is above a triggerable price, it will enter it and
 * cause it to open, removing the original tooltip. This will ensure that
 * no new tooltips will open until the user moves the mouse.
 */
var lockTrigger = false;

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
 * @param {String} crypto Crypto currency to convert from
 */
function openSelectionTooltip(currency, crypto) {
	// get the selected text
	var selection = getSelect(),
		x = 0, y = 0, text = ''
	;

	// in case the user did not select text, try to use the active element
	if (null === selection.x && null === selection.y) {
		var e = document.activeElement;
		selection = e.getBoundingClientRect();
		x = selection.x;
		y = selection.y;

		switch (e.nodeName.toLowerCase()) {
			case 'textarea':
			case 'input':
				text = e.value;
			break;
			case 'a':
				text = e.innerText;
			break;
			default: return;
		}

	// user selected text to convert
	} else {
		x = selection.x;
		y = selection.y;
		text = window.getSelection().toString();
	}

	// make sure the selected text is numerical, extract the first number selected
	var priceParse = text.match(/([0-9.]+)/);
	if (null == priceParse || null == priceParse[0] || "" == priceParse[0])
		return;

	// parse the selected text, pass our information and open our tooltip!
	openTooltip(
		parseFloat(priceParse[0]),
		x, y,
		true,
		currency,
		crypto
	);
}

/**
 * Gets the tooltip container window
 *
 * If an existing tooltip is on the page, this will fetch that
 * and we'll have to update it. Oterwise we just need to
 * create a brand new tooltip
 */
function getTooltip(forceOpen) {
	var active = document.getElementById(tooltipId + '-popup-active');
	if (null !== active) active.remove();

	var e = document.getElementById(tooltipId + '-popup');
	if (null !== e) {
		return e;
	}
	var tooltip = document.createElement('div');

	// assign specific CSS styles to our new element, tooltip
	Object.assign(tooltip.style, {
		'background-color': '#ddd',
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
		'box-shadow' : '0 0 3px 3px rgba(69,69,69,0.42)',
		'-webkit-transition': 'all 150ms ease',
		'-moz-transition': 'all 150ms ease',
		'-ms-transition': 'all 150ms ease',
		'-o-transition': 'all 150ms ease',
		'transition': 'all 150ms ease'
	});

	// define the ID to the tooltip
	tooltip.id = tooltipId + "-popup" + (forceOpen ? "-active" : "");

	// append the top logo and title to the tool tip
	tooltip.innerHTML = '<h2 style="font-size:11pt;margin-top:0px;padding-top:0px;">' +
							'<a href="' + diviURL + '" style="outline:0;text-decoration:none !important;border:0;color:#000" target="_blank">' +
								'<img src="' + getImage('resources/icon-divi.svg') +
									'" style="height:9.5pt;max-width:auto;margin-top:-3px; vertical-align: baseline;" /> The Divi Project' +
						'</a></h2>';

	tooltip.innerHTML += '<div class="tooltip-inner-content"></div>';

	tooltip.innerHTML += '<h4 style="font-size:10pt;font-weight:bold;color:#333">Crypto Made Easy</h4>';

	// if the tooltip is to be forced open, add a custom tooltip event listener
	if (forceOpen) {
		tooltip.addEventListener("mouseleave", (e) => {
			// remove this target if the mouse leaves the tooltip
			e.target.remove();
		});

		// set our lock
		lockTrigger = true;
	}

	// append the tooltip to the body!
	document.body.appendChild(tooltip);

	if (!forceOpen) {
		toolTips.push(tooltip);
	}
	activeTooltip = tooltip;
	return tooltip;
}

/**
 * Opens the conversion tooltip on page
 *
 * @param {Float}   price Price to convert
 * @param {Number}  x the x position to display the tooltip
 * @param {Number}  y the y position to display the tooltip
 * @param {Boolean} forceOpen Force the tooltip to be active and open
 * @param {Array}   activeCurrencies An array of currencies to display
 * @param {String}  crypto Crypto currency to convert from
 */
function openTooltip(price, x, y, forceOpen, activeCurrencies, crypto) {
	// predefine some variables we'll need
	var forceOpen  = forceOpen || false,
		tooltip    = getTooltip(forceOpen),
		x          = x || mouseX,
		y          = y || mouseY
		mainCurrencies = activeCurrencies || mainCurrencies,
		crypto = crypto || getWebsiteCurrency(window.location)
	;

	// we need to make sure we have currency data
	if (null === data || !data.crypto || !data.crypto[crypto]) return;

	price *= data.crypto[crypto].price_usd;

	var html = '';

	// loop through our acceptable currencies,
	mainCurrencies.forEach((c) => {
		// append currency to tooltip
		html += '<b>' + c + '</b>: ' +
				data.fiat[c].symbol + ' ' +
				(new Intl.NumberFormat('en-CA', {
					maximumFractionDigits: 2,
					minimumFractionDigits: 2
				}).format(price * data.fiat[c].usd)) +
			'<br />'
		;
	});

	// update the inner content
	tooltip.getElementsByClassName('tooltip-inner-content')[0].innerHTML = html;

	// calculate and assign tooltip top and left offsets
	tooltip.style.top  = calculateOffsetY(y, tooltip.getBoundingClientRect().height) + 'px';
	tooltip.style.left = calculateOffsetX(x, tooltip.getBoundingClientRect().width)  + 'px';

	// make the tooltip visible
	tooltip.style.visibility = '';
}

/**
 * Opens an alert window
 *
 * @param {String}  text Message to display
 * @param {Number}  x the x position to display the tooltip
 * @param {Number}  y the y position to display the tooltip
 * @param {Boolean} forceOpen Force the tooltip to be active and open
 */
function openAlert(text, x, y, forceOpen) {
	// predefine some variables we'll need
	var tooltip    = document.createElement('div'),
		x          = x || mouseX,
		y          = y || mouseY
		forceOpen  = forceOpen || false
	;

	// check if we have a forced active tooltip, remove if it exists
	var active = document.getElementById(tooltipId + '-popup-active');
	if (null !== active) active.remove();

	// assign specific CSS styles to our new element, tooltip
	Object.assign(tooltip.style, {
		background    : '#ef8282',
		color         : '#170b0b',
		border        : '1px solid #773a3a',

		position      : 'absolute',
		padding       : '20px 22px',
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

	// append tooltip motto
	tooltip.innerHTML += text;

	// if the tooltip is to be forced open, add a custom tooltip event listener
	if (forceOpen) {
		tooltip.addEventListener("mouseleave", (e) => {
			// remove this target if the mouse leaves the tooltip
			e.target.remove();
		});

		// set our lock
		lockTrigger = true;
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

	// make sure the text is numerical, extract the first number selected
	var price      = e.target.value || e.target.innerText,
		priceParse = price.match(/([0-9.]+)/);
	if (null == priceParse || null == priceParse[0] || "" == priceParse[0])
		return;

	var defaults = {
		price  : parseFloat(priceParse[0]),
		x      : e.clientX,
		y      : e.clientY,
		force  : false,
		active : null,
		curr   : null
	}

	// reset our lock
	lockTrigger = false;

	// if function has a custom function, call it and modify defaults
	if (e.target.hasAttribute('divitopia-function')) {
		var fn = triggerFunctions[e.target.getAttribute('divitopia-function')];
		if (typeof fn === 'function') {
			defaults = Object.assign(defaults, fn(e));
		}
	}

	// open a tooltip, pass along the element's text as the price
	// and the client's cursor position
	openTooltip(defaults.price, defaults.x, defaults.y, defaults.force, defaults.active, defaults.curr);
}

/**
 * Handler for an alert triggerable event
 *
 * @param {Element} e Element that triggered this event
 */
function handleAlertTrigger(e) {
	// if this element does not contain our tooltip's class, ignore it
	if (!e.target.classList || !e.target.classList.contains(triggerId) || !e.target.value)
		return;

	// parse our numbers
	var target = parseFloat(e.target.value);
	var yield  = getPriceYield(price, target);

	// if the potential loss >= threshold, alert the user
	if (yield >= alert_threshold && target > 0) {
		openAlert(
			'<b>Caution</b> You specified a BTC price that is off by<br />' +
				(yield*100).toFixed(1) +
			'% of the original asking price',
		null, null, true
		);
		return true;
	}
}

(function() {
	
	// fetch configuration data
	fetchWebdata();

	// update our currencies
	updateSettings();

	// create a global mouse enter event listener
	document.addEventListener('mouseenter', (e) => {
		// if the tooltip trigger has been locked, don't open it when the
		// mouse enters a triggerable element
		if (lockTrigger)
			return;

		// trigger the alert handler and skip the rest if its active
		if (handleAlertTrigger(e))
			return;

		// if this element does not contain our tooltip's class, ignore it
		if (!e.target.classList || !e.target.classList.contains(tooltipId))
			return;

		// let's open the tooltip from this element
		showTooltip(e);
	}, true);

	// handle fields that have been updated
	document.addEventListener('change', (e) => {
		handleAlertTrigger(e);
	});

	// create a global mouse out event listener
	document.addEventListener('mouseout', (e) => {
		if (tooltipId == e.target.id || e.target.classList && (
			e.target.classList.contains(tooltipId+'-popup') ||
			e.target.classList.contains(tooltipId)
		))
			reset = setTimeout(removeTooltip, 50);

		handleAlertTrigger(e);
	}, true);

	// create a global mouse move event listener
	document.addEventListener('mousemove', (e) => {
		// update our mouse positions
		mouseX = e.pageX;
		mouseY = e.pageY;

		// reset our lock
		lockTrigger = false;
	});

	// create an interval function every 1s
	setInterval(() => {
		// periodically update our currencies
		updateCurrencies();

		try {
			// remove any tooltips
			removeTooltip();
		} catch (ex) {
		}

		// check if we have no selectors, try to update
		if (null === selectors)
			selectors = getSelectors(window.location);

		if (null === specialTriggers)
			specialTriggers = getSpecialTriggers(window.location);

		// if the selectors didn't match our website, skip
		if (false === selectors)
			return;

		// find all elements matching our selectors and attach new class to it
		document.querySelectorAll(selectors).forEach((e) => {
			// ensure this element has not been marked yet
			if (!e.classList || e.classList.contains(tooltipId))
				return;

			// add the class to the element
			e.classList.add(tooltipId);
		});

		// find all elements matching our special triggers selectors and attach new class to it
		if (specialTriggers instanceof Array) {	
			Object.keys(specialTriggers).forEach((func) => {
				document.querySelectorAll(specialTriggers[func]).forEach((e) => {
					// ensure this element has not been marked yet
					if (!e.classList || e.classList.contains(tooltipId))
						return;

					// add the class to the element
					e.classList.add(tooltipId);

					e.setAttribute("divitopia-function", func);
				});
			});
		}

		// get this websites triggerable elements
		alerts = getAlertTriggers(window.location);

		// make sure we have something
		if (false !== alerts && null !== alerts) {
			// update active price source
			document.querySelectorAll(alerts.sources).forEach((e) => {
				price = getFirstFloat(e.innerText);
			});

			// make sure we have price data
			if (0.0 == price)
				return;

			// find all elements matching our selectors
			document.querySelectorAll(alerts.triggers).forEach((e) => {
				// ensure this element has not been marked yet
				if (!e.classList || e.classList.contains(triggerId))
					return;

				// add the class to the element
				e.classList.add(triggerId);
			});
		}
	}, 1000, 100);

})();