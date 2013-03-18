NODE_PATH ?= ./node_modules
JS_COMPILER = ./node_modules/uglify-js/bin/uglifyjs

all: dist/gpstile.min.js

dist/gpstile.js: src/gpstile.js src/gpstile.req.js
	browserify src/gpstile.req.js > dist/gpstile.js

dist/gpstile.min.js: dist/gpstile.js
	$(JS_COMPILER) dist/gpstile.js -c -o dist/gpstile.min.js
