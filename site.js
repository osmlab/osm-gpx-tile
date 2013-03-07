L.Control.Attribution.prototype.options.prefix = '';
var map = L.map('map', {minZoom: 14}).setView([38.9, -76.99], 13);
var attr = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors (this is <a href="http://github.com/tmcw/gpstile/">gpstile, and it is open source</a>)';
map.addHash();
(new mapbox.geocoderControl('tmcw.map-nlcg49tr')).addTo(map);

if (L.Browser.retina) {
    L.tileLayer('http://a.tiles.mapbox.com/v3/tmcw.map-8py9u67o/{z}/{x}/{y}.png', {
        attribution: attr
    }).addTo(map);
} else {
    L.tileLayer('http://a.tiles.mapbox.com/v3/tmcw.map-nlcg49tr/{z}/{x}/{y}.png', {
        attribution: attr
    }).addTo(map);
}

LgpsTile.addTo(map);
