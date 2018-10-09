import NLGAMap from "../src/NLGAMap/NLGAMap";

describe('NLGAMap', () => {

    it('creates a new instance', () => {
        let map = new NLGAMap({});
        assert.instanceOf(map, NLGAMap);
    });

});