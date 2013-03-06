NODE_PATH ?= ./node_modules
JS_COMPILER = uglifyjs

all: gpstile.js

gpstile.js: index.js
	browserify index.js > gpstile.js

gpstile.min.js: gpstile.js
	uglifyjs gpstile.js -c -m -o gpstile.min.js
