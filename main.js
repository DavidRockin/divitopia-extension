(function() {
	var prices        = null,
		activeTooltip = null,
		toolTips      = [],
		trigger       = null
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

	function showTooltip(e) {
		trigger = e;
		var btc = e.target.innerText;
		var price = parseFloat(btc) * (null !== prices ? prices.USD.last : 0);

		var tooltip  = document.createElement('div');
		Object.assign(tooltip.style, {
			background : '#dddd',
			border     : '1px solid #999',
			position   : 'absolute',
			'z-index'  : 99999999999,
			top        : (e.clientY+1) + 'px',
			left       : (e.clientX+1) + 'px',
			'text-align' : 'center',
			padding      : '9px 16px'
		});
		tooltip.id = 'diviTooltip';
		tooltip.innerHTML = '<h2 style="font-size:14pt;margin-top:0px;padding-top:0px;">' +
								'<img src="' + browser.extension.getURL('resources/icon.svg') +
									'" style="max-height:13.5pt;max-width:auto;" /> The Divi Project' +
							'</h2>';
		tooltip.innerHTML += btc + " BTC = $ " + price.toFixed(3) + " USD";
		tooltip.innerHTML += '<h4 style="font-size:12pt;">Crypto Made Easy</h4>';
		document.body.appendChild(tooltip);

		toolTips.push(tooltip);
		activeTooltip = tooltip;
	}

	fetchPrices();

	document.addEventListener('mouseenter', (e) => {
		if (!e.target.classList.contains('_divi'))
			return;
		showTooltip(e);
	}, true);

	document.addEventListener('mouseout', (e) => {
		reset = setTimeout(removeTooltip, 50);
	}, true);

	setInterval(() => {
		removeTooltip();
		document.querySelectorAll("tr.currencyData-tradepair td:nth-child(3), table#buyorders tbody tr td, table#sellorders tbody tr td").forEach((e) => {
			if (e.classList.contains('_divi'))
				return;
			e.classList.add('_divi');
		});
	}, 1000, 100);
})();