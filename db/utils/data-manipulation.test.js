const { createRef, formatItem } = require('./data-manipulation');

describe('createRef', () => {
    test('returns empty object when passed an empty array', () => {
        expect(createRef([])).toEqual({});
    });
    test('returns an object with a single property when passed an array with a single element', () => {
        const input = [
          {
            body:
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389,
          } 
          ];
        const expected = { "They're not exactly dogs, are they?" : 1};
        expect(createRef(input, 'belongs_to', 'article_id')).toEqual(expected);
    });
    test('returns an object when passed an array with a mutiple elements', () => {
        const input = [
            {
              owner_id: 1,
              forename: 'firstname-b',
              surname: 'lastname-b',
              age: 30
            },
            {
              owner_id: 2,
              forename: 'firstname-c',
              surname: 'lastname-c',
              age: 21
            },
            {
              owner_id: 3,
              forename: 'firstname-d',
              surname: 'lastname-d',
              age: 17
            }]
        const expected = { "firstname-b" : 1, "firstname-c" : 2, "firstname-d" : 3}
        expect(createRef(input, 'forename', 'owner_id')).toEqual(expected);
    });
});


describe('formatItem', () => {
    test('returns empty array when passed an empty array', () => {
        expect(formatItem([])).toEqual([]);
    });
    test('returns a new array with a single element when passed an array with a single element', () => {
        const item = [ { shop_name: 'shop-b', owner: 'firstname-b', slogan: 'slogan-b' }]
        const refObj = { "firstname-b" : 1};
        const keyToChange = "owner"
        const newKey = "owner_id"
        const expected = [ { shop_name: 'shop-b', owner_id : 1 , slogan: 'slogan-b' }]
        expect(formatItem(item, refObj, keyToChange, newKey)).toEqual(expected)
    });
    test('returns a new array with a mutiple elements when passed an array with mutiple element', () => {
        const item = [ { shop_name: 'shop-b', owner: 'firstname-b', slogan: 'slogan-b' }, 
        { shop_name: 'shop-d', owner: 'firstname-c', slogan: 'slogan-d' }]
        const refObj = { "firstname-b" : 1, "firstname-c" : 2}
        const keyToChange = "owner"
        const newKey = "owner_id"
        const expected = [ { shop_name: 'shop-b', owner_id : 1 , slogan: 'slogan-b' }, { shop_name: 'shop-d', owner_id : 2, slogan: 'slogan-d' }]
        expect(formatItem(item, refObj, keyToChange, newKey)).toEqual(expected)
    });
});