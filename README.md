~~~ Client ~~~

All client code exists in the master-client branch. The master-client branch is
also the branch the CI/CD server points to for production. Any and all changes
that pass the CI build tests will be reflected within the Heroku app.

https://image-aggregate-client.herokuapp.com

To deploy the app locally, make sure the .env file's environment variables are
correct for your current setup and you should just have to run:

 npm install
 npm start

We use ESLint to monitor our code quality and style.

Installation and use: https://eslint.org/docs/user-guide/getting-started

~~~ Server ~~~

All server code exists in the master-server branch. The master-server branch is
also the branch the CI/CD server points to for production. Any and all changes
that pass the CI build tests will be reflected within the Heroku app.

https://image-aggregate-server.herokuapp.com/

To deploy the server locally, make sure the .env file's environment variables
are correct for your current setup and then run:

 export FLASK_APP=api
 export FLASK_ENV=development|production
 pip install setuptools
 pip install -e .
 flask run --cert=cert.pem --key=key.pem

We use Pylint to monitor our code quality and style.

Installation: pip install pylint

Use: http://pylint.pycqa.org/en/latest/user_guide/run.html

~~~ Linting Practices ~~~

Pylint or ESLint with their default configuration (standard style guide) must be ran (automatically or
manually) on every file created and or edited by a developer.

~~~ Test Coverage ~~~

Both master-server and master-client branches have a test_coverage.html file at
the root containing a breakdown of the test coverage. Pytest was used for the
backend and cypress was used for the frontend and end-to-end testing.

~~~ Continuous Integration ~~~

Both master-server and master-client branches have .travis.yml files setup to
run continuous integration through Travis CI.

https://www.travis-ci.com/github/CSC-308/image-aggregate

[![Build Status](https://www.travis-ci.com/CSC-308/image-aggregate.svg?branch=master-server)](https://www.travis-ci.com/CSC-308/image-aggregate)

[![Build Status](https://www.travis-ci.com/CSC-308/image-aggregate.svg?branch=master-client)](https://www.travis-ci.com/CSC-308/image-aggregate)