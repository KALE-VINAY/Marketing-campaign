// import { StateGraph } from "langgraph";
// import { END, START } from "langgraph/constants";
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

// Create the campaign generation graph
// export function createCampaignGraph() {
//   // Create a new state graph
// //   const graph = new StateGraph<CampaignState>({
// //     channels: {
// //       businessInfo: {},
// //       campaignInfo: {},
// //       previousPerformance: {},
// //       adCopy: {},
// //       imagePrompt: {},
// //       imageUrl: {},
// //       targetingRecommendations: {},
// //       error: {},
// //     },
// //   });

//   // Add nodes to the graph
//   graph.addNode("generateCopy", generateCopyNode);
//   graph.addNode("generateImage", generateImageNode);
//   graph.addNode("generateTargeting", generateTargetingNode);

//   // Define the flow of the graph
//   graph.addEdge(START, "generateCopy");
//   graph.addEdge("generateCopy", "generateImage");
//   graph.addEdge("generateImage", "generateTargeting");
//   graph.addEdge("generateTargeting", END);

//   // Conditional edges - if there's an error, go to END
//   graph.addConditionalEdges(
//     "generateCopy",
//     (state) => (state.error ? "END" : "generateImage")
//   );
  
//   graph.addConditionalEdges(
//     "generateImage",
//     (state) => (state.error ? "END" : "generateTargeting")
//   );

//   // Compile the graph
//   return graph.compile();
// }

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
//   const campaignGraph = createCampaignGraph();
  
//   const result = await campaignGraph.invoke(input);
//   return result;
}