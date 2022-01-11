import {add0, getTime, getBetweenDay} from '../utils'


describe("util function test", () => {
    it('add0 test', () => {
        expect(add0(5)).toBe('05');
        expect(add0(12)).toBe('12');
    }),
    it('getBetweendDay test', () => {
        expect(getBetweenDay('20211215', 7)).toStrictEqual(['20211215',
                                                   '20211216',
                                                   '20211217',
                                                   '20211218',
                                                   '20211219',
                                                   '20211220',
                                                   '20211221',
                                                ])
    })
});