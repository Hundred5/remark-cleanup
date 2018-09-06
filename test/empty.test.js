import u from "unist-builder";
import cleanup from "../src";

const transform = cleanup();

test("removes empty formatting nodes", () => {
  const input = u("root", [
    u("paragraph", [
      u("text", "Hello "),
      u("bold", [u("text", ""), u("text", "")]),
      u("text", "world")
    ])
  ]);

  const expected = u("root", [
    u("paragraph", [u("text", "Hello "), u("text", "world")])
  ]);

  const output = transform(input);

  expect(output).toEqual(expected);
});

test("removes nested empty formatting nodes", () => {
  const input = u("root", [
    u("paragraph", [
      u("text", "Hello "),
      u("strong", u("emphasis", [u("text", "")])),
      u("text", "world")
    ])
  ]);

  const expected = u("root", [
    u("paragraph", [u("text", "Hello "), u("text", "world")])
  ]);

  const output = transform(input);

  expect(output).toEqual(expected);
});
