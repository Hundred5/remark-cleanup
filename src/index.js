import remove from "unist-util-remove";
import assign from "object-assign";

const removeEmptyTextNodes = tree => {
  return remove(tree, node => node.type === "text" && node.value === "");
};

const markNodeTypes = ["emphasis", "strong", "delete"];

const isMarkNode = node => {
  return markNodeTypes.indexOf(node.type) !== -1;
};

const findFirstText = children => {
  const firstChild = children[0];
  return firstChild.type === "text" ? firstChild : null;
};

const findLastText = children => {
  const lastChild = children[children.length - 1];
  return lastChild.type === "text" ? lastChild : null;
};

const extractLingeringSpaces = tree => {
  const processNode = node => {
    let next = assign({}, node);

    if (node.children) {
      next.children = node.children.reduce((acc, child) => {
        return [...acc, ...processNode(child)];
      }, []);
    }

    const ret = [next];

    if (isMarkNode(next) && next.children.length > 0) {
      const firstText = findFirstText(next.children);
      const lastText = findLastText(next.children);

      if (firstText) {
        const match = /^\s+/.exec(firstText.value);

        if (match) {
          ret.unshift({ type: "text", value: match[0] });
          firstText.value = firstText.value.slice(match[0].length);
        }
      }

      if (lastText) {
        const match = /\s+$/.exec(lastText.value);

        if (match) {
          ret.push({ type: "text", value: match[0] });
          lastText.value = lastText.value.slice(0, -match[0].length);
        }
      }
    }

    return ret;
  };

  const [result] = processNode(tree);
  return result;
};

const cleanup = () => {
  return node => {
    return removeEmptyTextNodes(extractLingeringSpaces(node));
  };
};

export default cleanup;
