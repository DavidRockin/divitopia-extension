(function() {
	var prices        = null,
		activeTooltip = null,
		toolTips      = [],
		trigger       = null,
		currencies    = ['USD','CAD','AUD','EUR','GBP','CNY'],
		tooltipId     = '_diviopia-tooltip',
		selectors     = [
			'tr.currencyData-tradepair td:nth-child(3)',
			'table#buyorders tbody tr td',
			'table#sellorders tbody tr td',
			'table#markethistory tbody tr.history-Sell td:nth-child(3)',
			'table#markethistory tbody tr.history-Sell td:nth-child(5)'
		].join(', ')
	;

	function fetchPrices() {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				prices = JSON.parse(this.responseText);
			}
		};
		xhttp.open("GET", "https://blockchain.info/ticker?cors=true", true);
		xhttp.send();
	}

	function isHover(e) {
		return (e.parentElement.querySelector(':hover') === e);
	}

	function removeTooltip() {
		clearInterval(reset);
		reset = null;
		toolTips.forEach((e) => {
			if (e === activeTooltip && isHover(trigger.target))
				return;
			e.remove();
		});
	}

	function getImage(url) {
		if (typeof browser === 'undefined') {
			return 'chrome-extension://' + chrome.runtime.id + '/' + url;
		}
		return browser.extension.getURL(url);
	}

	function showTooltip(e) {
		trigger = e;
		var btc = parseFloat(e.target.innerText);

		var tooltip  = document.createElement('div');
		Object.assign(tooltip.style, {
			background : '#dddd',
			border     : '1px solid #999',
			position   : 'absolute',
			'z-index'  : 99999999999,
			top        : (e.clientY+1) + 'px',
			left       : (e.clientX+1) + 'px',
			'text-align' : 'center',
			padding      : '9px 22px'
		});
		tooltip.id = tooltipId;
		tooltip.innerHTML = '<h2 style="font-size:14pt;margin-top:0px;padding-top:0px;">' +
								'<img src="' + getImage('resources/icon.svg') +
									'" style="height:12.5pt;max-width:auto;" /> The Divi Project' +
							'</h2>';
		currencies.forEach((c) => {
			tooltip.innerHTML += c + ": " + prices[c].symbol + ' ' + (btc*prices[c].last).toFixed(3) + '<br />';
		});
		tooltip.innerHTML += '<h4 style="font-size:12pt;">Crypto Made Easy</h4>';
		document.body.appendChild(tooltip);

		toolTips.push(tooltip);
		activeTooltip = tooltip;
	}

	fetchPrices();

	document.addEventListener('mouseenter', (e) => {
		if (!e.target.classList.contains(tooltipId))
			return;
		showTooltip(e);
	}, true);

	document.addEventListener('mouseout', (e) => {
		reset = setTimeout(removeTooltip, 50);
	}, true);

	setInterval(() => {
		removeTooltip();
		document.querySelectorAll(selectors).forEach((e) => {
			if (e.classList.contains(tooltipId))
				return;
			e.classList.add(tooltipId);
		});
	}, 1000, 100);
})();