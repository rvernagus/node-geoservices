compile:
	coffee -b --compile lib test

test: compile
	expresso test/*.js