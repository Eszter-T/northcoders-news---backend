const {
  changeTimeStamp,
  createRefObj,
  switchKeyRef,
} = require("../db/utils/data-manipulation");

describe("changeTimeStamp", () => {
  test("returns empty array when passed an empty array", () => {
    let input = [];
    let actual = changeTimeStamp(input);
    expect(actual).toEqual([]);
  });
  test("returns a js time stamp instead of unix", () => {
    let input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    let outPut = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "Thu Nov 15 2018 12:21:54 GMT+0000 (Greenwich Mean Time)",
        votes: 100,
      },
    ];
    let key = "created_at";
    let actual = changeTimeStamp(input, key);
    expect(actual).toEqual(outPut);
  });
  test("returns a js time stamp instead of unix for multiple objects", () => {
    let input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171,
      },
    ];
    let outPut = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "Thu Nov 15 2018 12:21:54 GMT+0000 (Greenwich Mean Time)",
        votes: 100,
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: "Wed Nov 17 2010 12:21:54 GMT+0000 (Greenwich Mean Time)",
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: "Sat Nov 18 2006 12:21:54 GMT+0000 (Greenwich Mean Time)",
      },
    ];
    let key = "created_at";
    let actual = changeTimeStamp(input, key);
    expect(actual).toEqual(outPut);
  });
  test("returns an unmutated array", () => {
    let input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    let key = "created_at";
    let actual = changeTimeStamp(input, key);
    expect(actual).not.toBe([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ]);
  });
});

describe.only("createRefObj", () => {
  test("should return an empty object when called with an empty array", () => {
    expect(createRefObj([])).toEqual({});
  });
  test("should take an array with a single object and 2 keys, and return an object with the value of those keys as a key-value pair.  ", () => {
    const input = [
      {
        body: "I hate streaming noses",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1385210163389,
      },
    ];
    const actual = createRefObj(input, "belongs_to", "article_id");
    const expected = { "Living in the shadow of a great man": 1 };
    expect(actual).toEqual(expected);
  });
  test("should work with multiple objects", () => {
    const input = [
      {
        owner_id: 1,
        forename: "firstname-b",
        surname: "lastname-b",
        age: 30,
      },
      {
        owner_id: 2,
        forename: "firstname-c",
        surname: "lastname-c",
        age: 21,
      },
      {
        owner_id: 3,
        forename: "firstname-d",
        surname: "lastname-d",
        age: 17,
      },
    ];
    const actual = createRefObj(input, "forename", "owner_id");
    const expected = { "firstname-b": 1, "firstname-c": 2, "firstname-d": 3 };
    expect(actual).toEqual(expected);
  });
  test("should not mutate the original array", () => {
    const input = [
      {
        owner_id: 1,
        forename: "firstname-b",
        surname: "lastname-b",
        age: 30,
      },
    ];
    const actual = createRefObj(input, "forename", "owner_id");
    expect(input).not.toBe(actual);
  });
});

describe.only("switchKeyRef", () => {
  const refObject = {
    "firstname-b": 1,
    "firstname-c": 2,
    "firstname-d": 3,
    "firstname-e": 4,
    "firstname-f": 5,
    "firstname-a": 6,
    "firstname-g": 7,
    "firstname-h": 8,
    "firstname-i": 9,
    "firstname-j": 10,
    "firstname-k": 11,
  };
  test("should return an empty array when called with an empty array", () => {
    expect(switchKeyRef([])).toEqual([]);
  });
  test("should switchKeyRef works on single object", () => {
    const input = [
      { shop_name: "shop-b", owner: "firstname-b", slogan: "slogan-b" },
    ];
    const actual = switchKeyRef(input, refObject, "owner", "owner_id");
    const output = [{ shop_name: "shop-b", owner_id: 1, slogan: "slogan-b" }];

    expect(actual).toEqual(output);
  });
  test("should switchKeyRef works on an array of several objects", () => {
    const input = [
      { shop_name: "shop-b", owner: "firstname-b", slogan: "slogan-b" },
      { shop_name: "shop-d", owner: "firstname-c", slogan: "slogan-d" },
      { shop_name: "shop-e", owner: "firstname-d", slogan: "slogan-e" },
    ];
    const actual = switchKeyRef(input, refObject, "owner", "owner_id");
    const output = [
      { shop_name: "shop-b", owner_id: 1, slogan: "slogan-b" },
      { shop_name: "shop-d", owner_id: 2, slogan: "slogan-d" },
      { shop_name: "shop-e", owner_id: 3, slogan: "slogan-e" },
    ];

    expect(actual).toEqual(output);
  });
  test("input array should not equal output array", () => {
    const input = [
      { shop_name: "shop-b", owner: "firstname-b", slogan: "slogan-b" },
      { shop_name: "shop-d", owner: "firstname-c", slogan: "slogan-d" },
      { shop_name: "shop-e", owner: "firstname-d", slogan: "slogan-e" },
    ];
    const actual = switchKeyRef(input, refObject, "owner", "owner_id");

    expect(actual).not.toBe(input);
  });
});
