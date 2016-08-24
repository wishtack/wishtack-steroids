
describe('123', () => {

    it('123', () => {

        class Test {
            double(x:number) {
                return 2 * x;
            }
        }

        expect(new Test().double(2)).toEqual(4);

    });

});

