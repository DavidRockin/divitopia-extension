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
