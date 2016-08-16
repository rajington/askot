import askot from '../../src/askot';

describe('askot', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(askot, 'greet');
      askot.greet();
    });

    it('should have been run once', () => {
      expect(askot.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(askot.greet).to.have.always.returned('hello');
    });
  });
});
