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
