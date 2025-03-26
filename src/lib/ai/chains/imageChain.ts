import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// Initialize the OpenAI model for image prompts
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "dall-e-3",
  temperature: 0.7,
});

// Create a prompt template for image generation prompts
const imagePromptTemplate = PromptTemplate.fromTemplate(`
You are an expert at creating prompts for AI image generators. 
Create a detailed, descriptive prompt that would generate an engaging marketing image based on:

Business Name: {businessName}
Industry: {industry}
Target Audience: {targetAudience}
Campaign Goal: {campaignGoal}
Platform: {platform}
Visual Style: {visualStyle}

The prompt should be detailed, specific, and designed to create a compelling marketing image.
Include details about composition, style, colors, mood, and what should be included in the image.
The prompt should be a single paragraph, ready to be fed into an image generation AI.
`);

// Create a chain for generating image prompts
export const imagePromptChain = RunnableSequence.from([
  imagePromptTemplate,
  model,
  new StringOutputParser(),
]);

// Function to generate image creation prompts
export async function generateImagePrompt(input: {
  businessName: string;
  industry: string;
  targetAudience: string;
  campaignGoal: string;
  platform: string;
  visualStyle: string;
}) {
  try {
    const imagePrompt = await imagePromptChain.invoke(input);
    
    // This would connect to an image generation API
    // For example, using OpenAI's DALL-E or Stability AI
    // For this example, we're just returning the prompt
    return {
      prompt: imagePrompt,
      // In a real implementation, you'd call another API here
      // imageUrl: await callImageGenerationAPI(imagePrompt)
    };
  } catch (error) {
    console.error("Error generating image prompt:", error);
    throw error;
  }
}