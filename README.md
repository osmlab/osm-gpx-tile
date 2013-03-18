## A GPS Tile Type

This hits the [OpenStreetMap GPX API](http://wiki.openstreetmap.org/wiki/API_v0.6#GPS_traces),
processes GPX with [toGeoJSON](https://github.com/tmcw/togeojson) and
draws pictures with Canvas.

It's just a tile type. You can use it with anything that uses types and lets
you use HTML5 Canvas. The example is with [Leaflet](http://leafletjs.com/),
but doesn't use any Leaflet stuff. See
[the connector](https://github.com/tmcw/gpstile/blob/gh-pages/gpstile.l.js) for
what that means.

It's put together with a little bit of [browserify](https://github.com/substack/node-browserify) and
[node-sphericalmercator](https://github.com/mapbox/node-sphericalmercator)

### Leaflet Integration

```js
// Leaflet
var layer = LgpsTile();
```

### Raw API

```js
gpsTile([z, x, y], canvas, function() {
    // called after initial tile draw
});
```
