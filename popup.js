(function() {

	var isFirefox  = typeof browser !== 'undefined',
		base       = (isFirefox  ? browser : chrome),
		currencies = ['USD','AUD','BRL','CAD','CHF','CLP','CNY','DKK','EUR','GBP','HKD','INR','ISK','JPY','KRW','NZD','PLN','RUB','SEK','SGD','THB','TWD'],
		menu       = document.getElementById('menu')
	;

	function addItem(text, callback, oncreate) {
		var l = document.createElement('li');
		l.innerText = text;
		if (null !== callback)
			l.addEventListener('mousedown', callback);
		menu.appendChild(l);
		if (oncreate)
			oncreate(l);
	}

	function addSeparator(oncreate) {
		var l = document.createElement('li');
		l.classList.add('separator');
		menu.appendChild(l);
		if (oncreate)
			oncreate(l);
	}

	function handleConvert(e) {
		var currency = e.target.getAttribute('data-currency');
		base.tabs.executeScript({
			code : 'var selectedNode = window.getSelection().getRangeAt(0).getBoundingClientRect();' +
					'var text = window.getSelection().toString();' +
					'if (null != text && text != "")' +
					'openTooltip(parseFloat(text), selectedNode.x,selectedNode.y, true, ["' + currency + '"]);'
		});
	}

	currencies.forEach((c) => {
		addItem('Convert to ' + c, handleConvert, (e) => {
			e.setAttribute('data-currency', c);
		});
	});

	addSeparator();
	addItem('Help', (e) => {
		base.tabs.create({
			url : base.runtime.getManifest().homepage_url + '/issues'
		});
	});
	addItem('v ' + base.runtime.getManifest().version, null, (e) => {
		e.classList.add('disabled');
	});

})();