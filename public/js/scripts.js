function makeTimeout(elems) {
	[].forEach.call(elems, function(elem) {
		var href = elem.getAttribute('href');
		elem.addEventListener('click', function(e) {
			if (href.length > 0 && href != window.location.pathname) {
				document.querySelector('.body-container').classList.remove('body-container_appear');
				document.querySelector('.body-container').classList.add('body-container_leaving');
				setTimeout(function() {
					window.location.href = elem.getAttribute('href');
				}, 320);
			}
			e.preventDefault();
		});
	})

};



makeTimeout(document.getElementsByTagName('a'));
