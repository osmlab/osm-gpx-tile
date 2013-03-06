org.polymaps.gpsLayer = org.polymaps.layer(function(tile, proj) {
    var o = tile.element = po.svg("foreignObject");
    var canvas = o.appendChild(document.createElement('canvas'));
    var w = 256;
    var h = 256;
    canvas.width = w * 2;
    canvas.height = w * 2;
    o.setAttribute("width", w);
    o.setAttribute("height", h);
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    gpsTile([tile.column, tile.row, tile.zoom], canvas, function(c) {
        tile.ready = true;
        org.polymaps.gpsLayer.dispatch({ type: 'load', tile: tile });
    });
    tile.request = function() {
        tile.ready = true;
    };
    tile.request.abort = function() {};
});
