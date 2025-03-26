import { RunnableLambda } from "@langchain/core/runnables";
import { generateAdCopy } from "../chains/copyChain";
import { generateImagePrompt } from "../chains/imageChain";
import { generateTargetingRecommendations } from "../chains/targetingChain";

// Define the state for our campaign generation graph
interface CampaignState {
  businessInfo: {
    businessName: string;
    industry: string;
    targetAudience: string;
  };
  campaignInfo: {
    campaignGoal: string;
    platform: string;
    tone: string;
    visualStyle: string;
  };
  previousPerformance?: string;
  adCopy?: string;
  imagePrompt?: string;
  imageUrl?: string;
  targetingRecommendations?: string;
  error?: string;
}

// Create nodes for our graph
const generateCopyNode = new RunnableLambda({
  func: async (state: CampaignState) => {
    try {
      const adCopy = await generateAdCopy({
        businessName: state.businessInfo.businessName,
        industry: state.businessInfo.industry,
        targetAudience: state.businessInfo.targetAudience,
        campaignGoal: state.campaignInfo.campaignGoal,
        platform: state.campaignInfo.platform,
        tone: state.campaignInfo.tone,
      });
      
      return { ...state, adCopy };
    } catch (error) {
      return {
        ...state,
        error: `Error generating ad copy: ${error}`,
      };
    }
  },
});

const generateImageNode = new RunnableLambda({
  func: async (state: CampaignState) => {
    try {
      const { prompt } = await generateImagePrompt({
        businessName: state.businessInfo.businessName,
        industry: state.businessInfo.industry,
        targetAudience: state.businessInfo.targetAudience,
        campaignGoal: state.campaignInfo.campaignGoal,
        platform: state.campaignInfo.platform,
        visualStyle: state.campaignInfo.visualStyle,
      });
      
      // In a real implementation, you would call an image generation API here
      // const imageUrl = await generateImage(prompt);
      
      return {
        ...state,
        imagePrompt: prompt,
        // imageUrl,
      };
    } catch (error) {
      return {
        ...state,
        error: `Error generating image: ${error}`,
      };
    }
  },
});

const generateTargetingNode = new RunnableLambda({
  func: async (state: CampaignState) => {
    try {
      const targetingRecommendations = await generateTargetingRecommendations({
        businessName: state.businessInfo.businessName,
        industry: state.businessInfo.industry,
        targetAudience: state.businessInfo.targetAudience,
        campaignGoal: state.campaignInfo.campaignGoal,
        platform: state.campaignInfo.platform,
        previousPerformance: state.previousPerformance || "No previous performance data",
      });
      
      return { ...state, targetingRecommendations };
    } catch (error) {
      return {
        ...state,
        error: `Error generating targeting recommendations: ${error}`,
      };
    }
  },
});

const START = "START";
const END = "END";

class StateGraph<T> {
  private nodes: Record<string, RunnableLambda<T, T, {}>> = {};
  private edges: Record<string, string[]> = {};
  private conditionalEdges: Record<string, (state: T) => string> = {};

  addNode(name: string, node: RunnableLambda<T, T, {}>) {
    this.nodes[name] = node;
  }

  addEdge(from: string, to: string) {
    if (!this.edges[from]) this.edges[from] = [];
    this.edges[from].push(to);
  }

  addConditionalEdges(from: string, condition: (state: T) => string) {
    this.conditionalEdges[from] = condition;
  }

  async invoke(initialState: T): Promise<T> {
    let currentState = initialState;
    let currentNode = START;

    while (currentNode !== END) {
      const nextNode = this.conditionalEdges[currentNode]
        ? this.conditionalEdges[currentNode](currentState)
        : this.edges[currentNode]?.[0];

      if (!nextNode) break;

      currentNode = nextNode;
      if (this.nodes[currentNode]) {
        currentState = await this.nodes[currentNode].invoke(currentState, {});
      }
    }

    return currentState;
  }
}

// Create the campaign generation graph
export function createCampaignGraph() {
  const graph = new StateGraph<CampaignState>();

  graph.addNode("generateCopy", generateCopyNode);
  graph.addNode("generateImage", generateImageNode);
  graph.addNode("generateTargeting", generateTargetingNode);

  graph.addEdge(START, "generateCopy");
  graph.addEdge("generateCopy", "generateImage");
  graph.addEdge("generateImage", "generateTargeting");
  graph.addEdge("generateTargeting", END);

  graph.addConditionalEdges("generateCopy", (state) =>
    state.error ? END : "generateImage"
  );
  graph.addConditionalEdges("generateImage", (state) =>
    state.error ? END : "generateTargeting"
  );

  return graph;
}

// Function to run the campaign generation graph
export async function generateFullCampaign(input: {
  businessInfo: {
    businessName: string;
    industry: string;
    targetAudience: string;
  };
  campaignInfo: {
    campaignGoal: string;
    platform: string;
    tone: string;
    visualStyle: string;
  };
  previousPerformance?: string;
}) {
  const campaignGraph = createCampaignGraph();
  const result = await campaignGraph.invoke(input);
  return result;
}