(function() {
	var events = [],
		prices = null
	;

	function fetchPrices() {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			console.log(this);
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
			background : '#333',
			border     : '1px solid #999',
			position   : 'absolute',
			'z-index'  : 99999999999,
			top        : (e.clientY+1) + 'px',
			left       : (e.clientX+1) + 'px'
		});
		tooltip.id = 'diviTooltip';
		tooltip.innerHTML = btc + " BTC = $ " + price.toFixed(3) + " USD";
		document.body.appendChild(tooltip);
	}

	fetchPrices();

	setInterval(() => {
		document.querySelectorAll("tr.currencyData-tradepair td:nth-child(3), table#buyorders tbody tr td, table#sellorders tbody tr td").forEach((d) => {
			registerEvent(d, 'mouseenter', (e) => {
				console.log(e);
				showTooltip(e);
			});
		});
	}, 1000, 100);
})();