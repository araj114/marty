var Marty = require('../../marty');
var expect = require('chai').expect;
var Dispatcher = require('./lib/mockDispatcher');
var describeStyles = require('./../lib/describeStyles');

describe('StateSource', function () {
  var stateSource;

  describeStyles('creating a state source', function (styles) {
    var expectedResult, expectedType, dispatcher, expectedArg1, expectedArg2;

    beforeEach(function () {
      expectedType = 'FOO';
      dispatcher = new Dispatcher();
      expectedResult = 'foo';
      expectedArg1 = 1;
      expectedArg2 = 'gib';
      stateSource = styles({
        classic: function () {
          return Marty.createStateSource({
            dispatcher: dispatcher,
            id: 'createStateSource',
            foo: function () {
              return this.bar();
            },
            bar: function () {
              return expectedResult;
            },
            bam: function () {
              this.dispatch(expectedType, expectedArg1, expectedArg2);
            }
          });
        },
        es6: function () {
          class CreateStateSource extends Marty.StateSource {
            foo() {
              return this.bar();
            }

            bar() {
              return expectedResult;
            }

            bam() {
              this.dispatch(expectedType, expectedArg1, expectedArg2);
            }
          }

          return new CreateStateSource({
            dispatcher: dispatcher
          });
        }
      });
    });

    it('should expose the function', function () {
      expect(stateSource.foo()).to.equal(expectedResult);
    });

    describe('when you dispatch', function () {
      var actualAction;

      beforeEach(function () {
        stateSource.bam();
        actualAction = dispatcher.getActionWithType(expectedType);
      });

      it('should dispatch an action with the constant name', function () {
        expect(actualAction).to.exist;
      });

      it('should pass through all the arguments', function () {
        expect(actualAction.arguments).to.eql([expectedArg1, expectedArg2]);
      });
    });
  });

  describe('#type', function () {
    describe('jsonStorage', function () {
      beforeEach(function () {
        stateSource = Marty.createStateSource({
          id: 'jsonStorage',
          type: 'jsonStorage'
        });
      });

      it('should mixin the JSONStorageStateSource', function () {
        expect(stateSource._isJSONStorageStateSource).to.be.true;
      });
    });

    describe('localStorage', function () {
      beforeEach(function () {
        stateSource = Marty.createStateSource({
          id: 'localStorage',
          type: 'localStorage'
        });
      });

      it('should mixin the LocalStorageStateSource', function () {
        expect(stateSource._isLocalStorageStateSource).to.be.true;
      });
    });

    describe('sessionStorage', function () {
      beforeEach(function () {
        stateSource = Marty.createStateSource({
          id: 'sessionStorage',
          type: 'sessionStorage'
        });
      });

      it('should mixin the SessionStorageStateSource', function () {
        expect(stateSource._isSessionStorageStateSource).to.be.true;
      });
    });

    describe('http', function () {
      beforeEach(function () {
        stateSource = Marty.createStateSource({
          id: 'http',
          type: 'http'
        });
      });

      it('should mixin the HttpStateSource', function () {
        expect(stateSource._isHttpStateSource).to.be.true;
      });
    });
  });

  describe('#mixins', function () {
    describe('when you have multiple mixins', function () {
      beforeEach(function () {
        stateSource = Marty.createStateSource({
          id: 'stateSourceWithMixins',
          mixins: [{
            foo: function () { return 'foo'; }
          }, {
            bar: function () { return 'bar'; }
          }]
        });
      });

      it('should allow you to mixin object literals', function () {
        expect(stateSource.foo()).to.equal('foo');
        expect(stateSource.bar()).to.equal('bar');
      });
    });
  });
});