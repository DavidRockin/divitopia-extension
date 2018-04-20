var triggerFunctions = {};

/**
 * Cryptopia Balance special trigger
 *
 * A quick and hacky way to detect the active currency
 * selected on the balances page
 *
 * @param {Element} e
 */
triggerFunctions.cryptopiaBalances = (e) => {
	try {
		var curr = e.target.parentNode.childNodes[3].childNodes[3].innerText;
		if (null !== curr)
			return {
				curr : curr.trim()
			}
	} catch (e) {
	}
	return {};
}

/**
 * Cryptopia special trigger for non-btc pricees
 *
 * @param {Element} c
 */
triggerFunctions.cryptopiaCurrency = (c) => {
	try {
		return {
			curr : document.querySelector('span.tradepair-symbol').innerText.split('/')[0].trim()
		}
	} catch (e) {}
	return {};
}

/**
 * Poloniex special trigger for non-btc pricees
 *
 * @param {Element} c
 */
triggerFunctions.poloniexCurrency = (c) => {
	try {
		return {
			curr : document.querySelector('div.mainHeading div.chartTitle div.code').innerText.split('/')[0].trim()
		}
	} catch (e) {}
	return {};
}

/**
 * Poloniex Balance special trigger
 *
 * @param {Element} e
 */
triggerFunctions.poloniexBalances = (e) => {
	try {
		var curr = e.target.parentNode.getAttribute('data-url');
		if (null !== curr)
			return {
				curr : curr.trim()
			}
	} catch (e) {
	}
	return {};
}

/**
 * Binance basic exchange currency detection
 *
 * @param {Element} e
 */
triggerFunctions.binanceBasic = (e) => {
	try {
		var curr = e.target.previousElementSibling;
		if (null !== curr)
			return {
				curr :  curr.innerHTML.split('/')[1].trim()
			}
	} catch (e) {
	}
	return {};
}

/**
 * Binance advanced exchange currency detection
 *
 * @param {Element} e
 */
triggerFunctions.binanceAdvanced = (e) => {
	try {
		var curr = e.target.parentNode.children[1];
		if (null !== curr)
			return {
				curr :  curr.innerHTML.split('/')[1].trim()
			}
	} catch (e) {
	}
	return {};
}