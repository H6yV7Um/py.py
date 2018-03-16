oojs.define({
    name: 'page',
    deps: {},
    $page: function () {
		window.adc = function adClickHandler() {
			var beacon = new Image();
			var key = 'google_monitor_' + (new Date());

			window[key] = beacon;
			beacon.src = '%%CLICK_URL_UNESC%%';
			beacon.onload = beacon.onerror = beacon.onabort = function () {
				window[key] = null;
				beacon = null;
			};
		}
    }
});