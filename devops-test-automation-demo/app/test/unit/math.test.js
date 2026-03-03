const { add, isEven } = require("../../src/utils/math");

test("add() should add two numbers", () => {
  expect(add(2, 3)).toBe(5);
});

test("isEven() should detect even numbers", () => {
  expect(isEven(10)).toBe(true);
  expect(isEven(7)).toBe(false);
});
