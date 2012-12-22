task :default => [:compile, :test]

task :compile do
	puts `coffee -b --compile lib test`
end

task :test do
	puts `mocha`
end