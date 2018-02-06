/**
 * Cryptopia Balance special trigger
 *
 * A quick and hacky way to detect the active currency
 * selected on the balances page
 *
 * @param {Element} e
 */
function cryptopiaBalances(e) {
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
function cryptopiaCurrency(c) {
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
function poloniexCurrency(c) {
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
function poloniexBalances(e) {
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
