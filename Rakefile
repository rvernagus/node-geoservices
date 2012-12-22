task :default => [:compile, :test]

task :compile do
	puts "Compiling coffee to javascript..."
	`coffee -b --compile lib test`
end

task :test do
	puts "Running tests..."
	puts `mocha`
end