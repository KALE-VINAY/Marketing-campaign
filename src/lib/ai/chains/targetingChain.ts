import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// Initialize the OpenAI model
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4-turbo",
  temperature: 0.5,
});

// Create a prompt template for targeting recommendations
const targetingPromptTemplate = PromptTemplate.fromTemplate(`
You are an expert marketing strategist.
Based on the following business information, provide targeting recommendations for their marketing campaign:

Business Name: {businessName}
Industry: {industry}
Current Target Audience: {targetAudience}
Campaign Goal: {campaignGoal}
Platform: {platform}
Previous Campaign Performance (if any): {previousPerformance}

Provide recommendations for:
1. Demographic targeting (age, gender, income, education, etc.)
2. Geographic targeting (locations to target)
3. Interest-based targeting (relevant interests, behaviors)
4. Optimal times to run the campaign
5. Budget allocation recommendations

Format your response in a clear, structured way.
`);

// Create a chain for generating targeting recommendations
export const targetingChain = RunnableSequence.from([
  targetingPromptTemplate,
  model,
  new StringOutputParser(),
]);

// Function to generate targeting recommendations
export async function generateTargetingRecommendations(input: {
  businessName: string;
  industry: string;
  targetAudience: string;
  campaignGoal: string;
  platform: string;
  previousPerformance: string;
}) {
  try {
    const result = await targetingChain.invoke(input);
    return result;
  } catch (error) {
    console.error("Error generating targeting recommendations:", error);
    throw error;
  }
}