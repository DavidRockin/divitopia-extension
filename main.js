(function() {
	var events = [],
		prices = null
	;

	function fetchPrices() {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				prices = JSON.parse(this.responseText);
			}
		};
		xhttp.open("GET", "https://blockchain.info/ticker?cores=true", true);
		xhttp.send();
	}

	function registerEvent(element, type, callback) {
		if (events.indexOf(element) > -1)
			return;
		element.addEventListener(type, callback);
		events.push(element);
	}

	function showTooltip(e) {
		var el = document.getElementById('diviTooltip');
		if (null !== el) el.remove();

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
		tooltip.innerHTML = '<h2 style="font-size:14pt;margin-top:0px;padding-top:0px;">The Divi Project</h2>';
		tooltip.innerHTML += btc + " BTC = $ " + price.toFixed(3) + " USD";
		tooltip.innerHTML += '<h4 style="font-size:12pt;">Crypto Made Easy</h4>';
		document.body.appendChild(tooltip);
	}

	fetchPrices();

	setInterval(() => {
		document.querySelectorAll("tr.currencyData-tradepair td:nth-child(3), table#buyorders tbody tr td, table#sellorders tbody tr td").forEach((d) => {
			registerEvent(d, 'mouseenter', (e) => {
				showTooltip(e);
			});
		});
	}, 1000, 100);
})();