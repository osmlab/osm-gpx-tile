var LgpsTile = L.tileLayer.canvas({
    detectRetina: true
});

LgpsTile.drawTile = function(canvas, t, zoom) {
    if (zoom > 12) {
        gpsTile([t.x, t.y, zoom], canvas, function() {});
    }
};
