var merc = require('sphericalmercator');

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
            xml(url + '&page=1', function(err, x) {
                if (err) return; // TODO: handle
                draw(canvas, xyz, toGeoJSON.gpx(x.responseXML));
            });
            xml(url + '&page=2', function(err, x) {
                if (err) return; // TODO: handle
                draw(canvas, xyz, toGeoJSON.gpx(x.responseXML));
            });
            cb();
        });
    }

    function draw(c, xyz, gj) {
        function tileProj(ll) {
            var px = proj.px(ll, xyz[2]);
            px[0] -= xyz[0] * 256;
            px[1] -= xyz[1] * 256;
            return [~~px[0], ~~px[1]];
        }
        function dist(a, b) {
            return (
                Math.abs(a[0] - b[0]) +
                Math.abs(a[1] - b[1]));
        }
        var ctx = c.getContext('2d');
        var px;
        var colors = ['cyan', 'magenta', 'yellow', '#96FFA7'];
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        ctx.globalCompositeOperation = 'lighter';
        var color = 0;
        for (var i = 0; i < gj.features.length; i++) {
            var f = gj.features[i];
            var last = [];
            if (f.geometry.type == 'LineString') {
                var coords = f.geometry.coordinates;
                if (coords.length < 2) continue;
                ctx.strokeStyle = colors[color++ % 4];

                ctx.beginPath();
                last = px = tileProj(coords[0]);
                ctx.moveTo(px[0], px[1]);

                for (var j = 1; j < coords.length; j++) {
                    px = tileProj(coords[j]);
                    var d = dist(px, last);
                    if (d > 30) {
                        ctx.stroke();
                        ctx.strokeStyle = colors[color++ % 4];
                        ctx.beginPath();
                        ctx.moveTo(px[0], px[1]);
                        last = px;
                    } else if (d > 2) {
                        ctx.lineTo(px[0], px[1]);
                        last = px;
                    }
                }

                ctx.stroke();
            }
        }
    }

    if (typeof module !== 'undefined') module.exports = gpsTile;
    if (typeof window !== 'undefined') window.gpsTile = gpsTile;
})();
