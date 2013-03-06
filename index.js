var merc = require('sphericalmercator'),
    autoscale = require('autoscale-canvas');

function xml(url, callback) {
    var xhr = new XMLHttpRequest(),
        twoHundred = /^20\d$/;
    xhr.onreadystatechange = function() {
        if (4 == xhr.readyState && 0 !== xhr.status) {
            if (twoHundred.test(xhr.status)) {
                callback(null, xhr);
            } else {
                callback(xhr, null);
            }
        }
    };
    xhr.onerror = function(e) { return callback(e, null); };
    xhr.open('GET', url, true);
    xhr.send();
}

(function() {
    var base = 'http://api.openstreetmap.org/api/0.6/trackpoints?bbox=';
    var proj = new merc();

    function gpsTile(xyz, canvas, cb) {
        var bbox = proj.bbox(xyz[0], xyz[1], xyz[2]);
        var url = base + bbox;
        xml(url, function(err, x) {
            if (err) return; // TODO: handle
            draw(canvas, xyz, toGeoJSON.gpx(x.responseXML));
            cb();
        });
    }

    function draw(c, xyz, gj) {
        function tileProj(ll) {
            var px = proj.px(ll, xyz[2]);
            px[0] -= xyz[0] * 256;
            px[1] -= xyz[1] * 256;
            return px;
        }
        var ctx = c.getContext('2d');
        autoscale(c);
        ctx.fillRect(0, 0, 20, 20);
        var px;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        for (var i = 0; i < gj.features.length; i++) {
            var f = gj.features[i];
            if (f.geometry.type == 'LineString') {
                var coords = f.geometry.coordinates;
                if (coords.length < 2) continue;

                ctx.beginPath();
                px = tileProj(coords[0]);
                ctx.moveTo(px[0], px[1]);

                for (var j = 1; j < coords.length; j++) {
                    px = tileProj(coords[j]);
                    ctx.lineTo(px[0], px[1]);
                }

                ctx.stroke();
            }
        }
    }

    if (typeof module !== 'undefined') module.exports = gpsTile;
    if (typeof window !== 'undefined') window.gpsTile = gpsTile;
})();
