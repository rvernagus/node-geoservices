compile:
	coffee -b --compile lib test

test: compile
	mocha