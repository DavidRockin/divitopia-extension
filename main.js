(function() {
	var events = [];

	function registerEvent(element, type, callback) {
		if (events.indexOf(element) > -1)
			return;
		element.addEventListener(type, callback);
		events.push(element);
	}

	setInterval(() => {
		document.querySelectorAll("tr.currencyData-tradepair td:nth-child(3), table#buyorders tbody tr td, table#sellorders tbody tr td").forEach((d) => {
			registerEvent(d, 'mouseenter', (e) => {
				console.log(e.target.innerText);
			});
		});
	}, 1000, 100);
})();