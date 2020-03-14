const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      return tag({ ...props, children });
    }
    return { tag, props: { ...props, children } };
  }
};

const states = [];
let stateIndex = 0;

function useState(initialState) {
  let state;
  const selfIndex = stateIndex++;
  if (typeof states[selfIndex] === "undefined") {
    state = states[selfIndex] = initialState;
  } else {
    state = states[selfIndex];
  }
  const setState = newState => {
    console.log("setState called with ", newState);
    states[selfIndex] = newState;
    stateIndex = 0;
    rerender();
  };
  return [state, setState];
}

const App = () => {
  const [name, setName] = useState("hello");
  const [count, setCount] = useState(0);
  return (
    <div>
      <input type="text" value={name} onchange={e => setName(e.target.value)} />
      <h1>Hello {name}</h1>
      <h1>count is {count}</h1>
      <button onclick={() => setCount(count+1)}>+</button>
      <button onclick={() => setCount(count-1)}>-</button>
    </div>
  );
};

function render(reactElement: type, container: Node) {
  console.log(reactElement);
  const {
    tag,
    props: { children, ...props }
  } = reactElement;
  const domNode = document.createElement(tag);
  Object.keys(props || {}).map(key => {
    domNode[key] = props[key];
  });

  (children || []).forEach(child => {
    if (['string', 'number'].includes(typeof child)) {
      domNode.appendChild(document.createTextNode(child));
    } else {
      console.log({ child });
      render(child, domNode);
    }
  });
  container.appendChild(domNode);
}
function rerender() {
  document.querySelector("#app")?.firstElementChild?.remove();
  render(<App />, document.querySelector("#app"));
}
render(<App />, document.querySelector("#app"));
