all: env node dep compass test

env:
	@echo Checking/setting NODE_ENV...
ifneq "$(NODE_ENV)" "development"
	echo "export NODE_ENV=development" >> ~/.bashrc
	. ~/.bashrc
endif

node:
	@echo Installing Kraken generator, Bower, and Grunt...
	sudo npm install -g generator-kraken
	sudo npm install -g bower
	sudo npm install -g grunt-cli
	sudo npm install -g js-beautify

dep:
	@echo installing dependancies...
	npm install
	grunt githooks

compass:
	@echo Installing sass components...
	gem update --system
	gem install compass

test:
	grunt test
