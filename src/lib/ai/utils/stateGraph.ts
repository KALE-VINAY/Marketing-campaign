export const START = "START";
export const END = "END";

interface Node<State> {
  name: string;
  func: (state: State) => Promise<State>;
}

interface Edge<State> {
  from: string;
  to: string | ((state: State) => string);
}

export class StateGraph<State> {
  private nodes: Record<string, Node<State>> = {};
  private edges: Edge<State>[] = [];
  private channels: Record<string, unknown>;

  constructor(config: { channels: Record<string, unknown> }) {
    this.channels = config.channels;
  }

  addNode(name: string, node: Node<State>) {
    this.nodes[name] = { name, func: node.func };
  }

  addEdge(from: string, to: string) {
    this.edges.push({ from, to });
  }

  addConditionalEdges(from: string, condition: (state: State) => string) {
    this.edges.push({ from, to: condition });
  }

  async invoke(initialState: State): Promise<State> {
    let currentState = initialState;
    let currentNode = START;

    while (currentNode !== END) {
      const edge = this.edges.find((e) => e.from === currentNode);
      if (!edge) throw new Error(`No edge found from node: ${currentNode}`);

      const nextNode = typeof edge.to === "function" ? edge.to(currentState) : edge.to;
      if (nextNode === END) break;

      const node = this.nodes[nextNode];
      if (!node) throw new Error(`Node not found: ${nextNode}`);

      currentState = await node.func(currentState);
      currentNode = nextNode;
    }

    return currentState;
  }

  compile() {
    return this;
  }
}
