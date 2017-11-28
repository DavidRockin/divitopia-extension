	var prices        = null,
		activeTooltip = null,
		toolTips      = [],
		trigger       = null,
		currencies    = ['USD','CAD','AUD','EUR','GBP','CNY'],
		tooltipId     = '_diviopia-tooltip',
		diviURL       = 'https://www.diviproject.org/',
		selectors     = [
			'tr.currencyData-tradepair td:nth-child(3)',
			'table#buyorders tbody tr td',
			'table#sellorders tbody tr td',
			'table#markethistory tbody tr.history-Sell td:nth-child(3)',
			'table#markethistory tbody tr.history-Sell td:nth-child(5)',
			'table#currencyData-BTC tbody tr td:nth-last-child(-n+5)'
		].join(', ')
	;

	var mouseX = 0,
		mouseY = 0
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
			if (e === activeTooltip && isHover(trigger.target) || isHover(document.getElementById(tooltipId + '-popup')))
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

	function calculateOffsetX(clientX, width) {
		var x = clientX + 5;
		return (x+width > window.innerWidth ? window.innerWidth - width - 20: x);
	}

	function calculateOffsetY(clientY, height) {
		var y = clientY + 1;
		return (y+height > window.innerHeight ? y - height : y);
	}

	function openTooltip(price, x, y, forceActive) {
		var tooltip  = document.createElement('div'),
			x        = x || mouseX,
			y        = y || mouseY
			forceActive = forceActive || false
		;

		var active = document.getElementById(tooltipId + '-popup-active');
		if (null !== active) active.remove();

		Object.assign(tooltip.style, {
			background : '#dddd',
			border     : '1px solid #999',
			position   : 'absolute',
			'z-index'  : 99999999999,
			'text-align' : 'center',
			padding      : '9px 22px',
			color        : '#666',
			'font-family' : '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',

			visibility    : 'hidden',

			'-webkit-box-shadow' : '0 0 3px 3px rgba(69,69,69,0.42)',
			'box-shadow' : '0 0 3px 3px rgba(69,69,69,0.42)'
		});
		tooltip.id = tooltipId + "-popup" + (forceActive ? "-active" : "");
		tooltip.innerHTML = '<h2 style="font-size:14pt;margin-top:0px;padding-top:0px;">' +
								'<a href="' + diviURL + '" style="outline:0;text-decoration:none !important;border:0;color:#000" target="_blank">' +
									'<img src="' + getImage('resources/icon-divi.svg') +
										'" style="height:12.5pt;max-width:auto;margin-top:-5px;" /> The Divi Project' +
							'</a></h2>';
		currencies.forEach((c) => {
			tooltip.innerHTML += c + ": " + prices[c].symbol + ' ' + (price*prices[c].last).toFixed(3) + '<br />';
		});
		tooltip.innerHTML += '<h4 style="font-size:12pt;font-weight:bold;color:#333">Crypto Made Easy</h4>';

		if (forceActive) {
			tooltip.addEventListener("mouseleave", (e) => {
				e.target.remove();
			});
		}

		document.body.appendChild(tooltip);

		tooltip.style.top  = calculateOffsetY(y, tooltip.getBoundingClientRect().height) + 'px';
		tooltip.style.left = calculateOffsetX(x, tooltip.getBoundingClientRect().width)  + 'px';

		tooltip.style.visibility = '';

		if (!forceActive) {
			toolTips.push(tooltip);
		}
		activeTooltip = tooltip;
	}

	function showTooltip(e) {
		trigger = e;
		openTooltip(
			parseFloat(e.target.innerText),
			e.clientX,
			e.clientY
		);
	}

(function() {
	fetchPrices();

	document.addEventListener('mouseenter', (e) => {
		if (!e.target.classList.contains(tooltipId))
			return;
		showTooltip(e);
	}, true);

	document.addEventListener('mouseout', (e) => {
		reset = setTimeout(removeTooltip, 50);
	}, true);

	document.addEventListener('mousemove', (e) => {
		mouseX = e.pageX;
		mouseY = e.pageY;
	});

	setInterval(() => {
		try {
			removeTooltip();
		} catch (ex) {
		}
		document.querySelectorAll(selectors).forEach((e) => {
			if (e.classList.contains(tooltipId))
				return;
			e.classList.add(tooltipId);
		});
	}, 1000, 100);

})();