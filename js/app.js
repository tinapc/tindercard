var app = [];

app = {
	disablePulltoRefresh: function(){
		// Disable Pull to refresh
        var lastTouchY = 0;
        var preventPullToRefresh = false;

        $('body').on('touchstart', function (e) {
            if (e.originalEvent.touches.length != 1) { return; }
            lastTouchY = e.originalEvent.touches[0].clientY;
            preventPullToRefresh = window.pageYOffset == 0;
        });

        $('body').on('touchmove', function (e) {
            var touchY = e.originalEvent.touches[0].clientY;
            var touchYDelta = touchY - lastTouchY;
            lastTouchY = touchY;
            if (preventPullToRefresh) {
                // To suppress pull-to-refresh it is sufficient to preventDefault the first overscrolling touchmove.
                preventPullToRefresh = false;
                if (touchYDelta > 0) {
                    e.preventDefault();
                    return;
                }
            }
        });
	}
}