(function() {

	var isFirefox  = typeof browser !== 'undefined',
		base       = (isFirefox  ? browser : chrome),
		currencies = ['USD','CAD','EUR'],
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
					'openTooltip(parseFloat(window.getSelection().toString()), selectedNode.x,selectedNode.y, true, ["' + currency + '"]);'
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