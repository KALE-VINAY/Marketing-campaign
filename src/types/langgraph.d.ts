declare module "langgraph" {
  export class StateGraph<T> {
    constructor(config: { channels: Record<string, unknown> });
    addNode(name: string, runnable: unknown): void;
    addEdge(from: string, to: string): void;
    addConditionalEdges(from: string, condition: (state: T) => string): void;
    compile(): { invoke(input: T): Promise<T> };
  }
}

declare module "langgraph/constants" {
  export const START: string;
  export const END: string;
}
