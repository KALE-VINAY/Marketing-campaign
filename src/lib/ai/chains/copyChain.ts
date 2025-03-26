import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// Initialize the OpenAI model
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4.5-preview",
  temperature: 0.7,
});

// Create a prompt template for ad copy generation
const copyPromptTemplate = PromptTemplate.fromTemplate(`
You are an expert marketing copywriter.
Generate engaging ad copy for the following business:

Business Name: {businessName}
Industry: {industry}
Target Audience: {targetAudience}
Campaign Goal: {campaignGoal}
Platform: {platform}
Tone: {tone}

Generate 3 variations of ad copy that are compelling, concise, and aligned with the brand's voice.
Each ad copy should include a headline and body text, formatted cleanly.
Include a call-to-action that aligns with the campaign goal.
`);

// Create a chain for generating ad copy
export const copyChain = RunnableSequence.from([
  copyPromptTemplate,
  model,
  new StringOutputParser(),
]);

// Function to generate ad copy
export async function generateAdCopy(input: {
  businessName: string;
  industry: string;
  targetAudience: string;
  campaignGoal: string;
  platform: string;
  tone: string;
}) {
  try {
    const result = await copyChain.invoke(input);
    return result;
  } catch (error) {
    console.error("Error generating ad copy:", error);
    throw error;
  }
}