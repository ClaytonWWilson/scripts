type ElementItem =
  | [keyof HTMLElementTagNameMap, HTMLAttributes, ElementItem[] | string]
  | [string];

type HTMLAttributes = {
  [attr: string]: any;
};

const html = (tree: ElementItem | string) => {
  if (typeof tree === "string") {
    return document.createTextNode(tree);
  }

  if (tree.length === 1) {
    return document.createTextNode(tree[0]);
  }

  const tag = tree[0];
  const attrs = tree[1];
  const children = tree[2];

  let el = document.createElement(tag);
  if (attrs) {
    for (let attribute of Object.entries(attrs)) {
      if (attribute[0].indexOf("on") === 0) {
        el.addEventListener(
          attribute[0].substring(2).toLowerCase(),
          attribute[1],
          false
        );
      } else {
        el.setAttribute(attribute[0], attribute[1]);
      }
    }
  }

  if (children) {
    if (typeof children === "string") {
      const textNode = document.createTextNode(children);
      el.appendChild(textNode);
      return el;
    }
    for (let child of children) {
      let childEl = html(child);
      el.appendChild(childEl);
    }
  }

  return el;
};

export default html;
