import u from "unist-builder";
import cleanup from "../src";

const transform = cleanup();

test("fixes nodes with spaces only", () => {
  const input = u("root", [
    u("paragraph", [
      u("text", "Hello"),
      u("strong", u("emphasis", [u("text", "   ")])),
      u("text", "world")
    ])
  ]);

  const expected = u("root", [
    u("paragraph", [u("text", "Hello"), u("text", "   "), u("text", "world")])
  ]);

  const output = transform(input);

  expect(output).toEqual(expected);
});

test("fixes nodes with leading and trailing spaces", () => {
  const input = u("root", [
    u("paragraph", [
      u("strong", u("emphasis", [u("text", "Hello ")])),
      u("strong", u("emphasis", [u("text", "  beautiful ")])),
      u("strong", u("emphasis", [u("text", "  world")]))
    ])
  ]);

  const expected = u("root", [
    u("paragraph", [
      u("strong", u("emphasis", [u("text", "Hello")])),
      u("text", " "),
      u("text", "  "),
      u("strong", u("emphasis", [u("text", "beautiful")])),
      u("text", " "),
      u("text", "  "),
      u("strong", u("emphasis", [u("text", "world")]))
    ])
  ]);

  const output = transform(input);

  expect(output).toEqual(expected);
});
