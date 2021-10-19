
const findComponentParent = function (context, componentName) {
  let parent = context.$parent || context.$root;
  let name = parent.$options.componentName;
  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent;
    if (parent) {
      name = parent.$options.componentName;
    }
  }
  if (parent)
    return parent;
}
const findComponentChildren = function (context, componentName) {
  let children = context.$children,
    validateChildren = children.map((child) => {
      if (child.$options.componentName == componentName) {
        return child
      }
    });

  return validateChildren

}
export { findComponentParent, findComponentChildren }