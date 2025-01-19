import { HfInference } from "@huggingface/inference";
import MeditationSession from "@/lib/db/models/meditationsession.model";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import User from "@/lib/db/models/user.model";
import mongoose, { mongo } from "mongoose";
import MeditationPreferences from "@/lib/db/models/meditation.model";

// Initialize the HuggingFace client with your API key
const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Function to generate the meditation script using the HuggingFace API
const generateMeditationScript = async (prompt: string) => {
  console.log("Sending request to HuggingFace API with prompt:", prompt); // Log the prompt

  try {
    // Call the HuggingFace API for chat completion using your specified model
    const chatCompletion = await client.chatCompletion({
      model: "microsoft/Phi-3-mini-4k-instruct", // Specify the model
      messages: [
        {
          role: "user",
          content: prompt, // Provide the prompt to the model
        },
      ],
      max_tokens: 500, // Adjust based on your requirements
    });

    // Log and return the generated script
    console.log(
      "Received meditation script from HuggingFace:",
      chatCompletion.choices[0].message
    ); // Log the response
    return chatCompletion.choices[0]?.message?.content || ""; // Return the generated content
  } catch (error) {
    console.error("Error generating meditation script:", error); // Log the error
    throw new Error("Failed to generate meditation script from HuggingFace");
  }
};

// The main API endpoint to handle POST requests for generating meditation sessions
export async function POST(req: NextApiRequest) {
  try {
    console.log("Received POST request:", req.body); // Log the incoming request body

    const {
      userId,
      mentalHealthGoal,
      sessionLength,
      meditationType,
      toneOfVoice,
      backgroundMusic,
    } = await req.json();

    console.log("Parsed request data:", {
      userId,
      mentalHealthGoal,
      sessionLength,
      meditationType,
      toneOfVoice,
      backgroundMusic,
    }); // Log the parsed data

    const meditationTypeArray = Array.isArray(meditationType)
      ? meditationType
      : [meditationType];

    const prompt = `
      Generate a meditation session script based on the following preferences:
      Mental Health Goal: ${mentalHealthGoal}
      Session Length: ${sessionLength}
      Meditation Type: ${meditationTypeArray.join(", ")}
      Tone of Voice: ${toneOfVoice}
      Background Music: ${backgroundMusic}
      
      Generate a guided meditation session script that follows these preferences. Ensure the content is focused on meditation and calmness, and avoid unrelated technical jargon.
    `;

    console.log("Generated prompt:", prompt); // Log the generated prompt

    // Generate the meditation script using the HuggingFace API
    const meditationScript = await generateMeditationScript(prompt);

    if (!meditationScript) {
      throw new Error("Generated meditation script is empty or invalid");
    }

    // console.log("Successfully generated meditation script:", meditationScript); // Log the generated script

    // Save the generated script to the database
    const newMeditationSession = new MeditationSession({
      userId,
      meditationScript,
    });

    await newMeditationSession.save();

    await MeditationPreferences.findByIdAndUpdate(userId, {
      $push: { meditationSessions: newMeditationSession._id },
    });

    console.log("Meditation session saved successfully. "); // Log when session is saved

    return NextResponse.json(
      {
        message: "Script Generated successfully",
        generated_text: meditationScript,
      }, // send the meditation script as 'generated_text'
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating meditation:", error); // Log the error
    return NextResponse.json(
      { message: "Error generating meditation script" },
      { status: 500 }
    );
  }
}
