import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Step 1: Parse the request body to get email, password, userId, and audioData
    const { email, password, userId, audioData } = await req.json();

    // Validate the input data
    if (!email || !password || !userId || !audioData) {
      return NextResponse.json(
        { error: "Email, password, userId, and audio data are required" },
        { status: 400 }
      );
    }

    // Log the received input (For debugging purposes)
    console.log("Received input:", { email, password, userId, audioData });

    // Sanitize meditation script to remove unwanted data or excess whitespace
    const sanitizedMeditationScript = audioData.meditationScript
      .trim()
      .replace(/\n\s*\n/g, "\n");
    audioData.meditationScript = sanitizedMeditationScript;

    // Step 2: Authenticate by making a POST request to login
    const loginResponse = await fetch(`http://localhost:4000/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!loginResponse.ok) {
      // Handle login failure and forward the error response
      const errorMessage = await loginResponse.text(); // Capture error response
      console.error("Login failed:", errorMessage);
      return NextResponse.json(
        { error: `Login failed: ${errorMessage}` },
        { status: loginResponse.status }
      );
    }

    const loginData = await loginResponse.json();
    const bearerToken = loginData.token;

    if (!bearerToken) {
      return NextResponse.json(
        { error: "Failed to get authentication token" },
        { status: 500 }
      );
    }

    // Step 3: Use the token to generate audio by making a POST request to the /api/audio endpoint
    const audioResponse = await fetch(`http://localhost:4000/api/audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`, // Include the token for authorization
      },
      body: JSON.stringify({
        meditationScript: audioData.meditationScript,
        bgmusic: audioData.bgmusic,
        userId: userId,
      }),
    });

    // Check if the response is in JSON format
    let audioResponseBody;
    try {
      audioResponseBody = await audioResponse.json();
    } catch (error) {
      // If response is not JSON, capture the response as plain text for debugging
      const responseText = await audioResponse.text();
      console.error("Audio response body (non-JSON):", responseText);
      return NextResponse.json(
        { error: "Failed to generate audio. Response was not in JSON format." },
        { status: 500 }
      );
    }

    console.log("Audio response status:", audioResponse.status);
    console.log("Audio response body:", audioResponseBody);

    if (!audioResponse.ok) {
      // If audio generation failed, log and return a detailed error
      return NextResponse.json(
        {
          error: `Failed to generate audio: ${
            audioResponseBody.message || "Unknown error"
          }`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Audio generation scheduled" },
      { status: 200 }
    );
  } catch (error) {
    // Catch and handle different types of errors
    console.error("Error during the process:", error);

    if (error.code === "ECONNREFUSED") {
      console.error("API connection refused:", error);
      return NextResponse.json(
        {
          error: "Could not connect to the API server. Please try again later.",
        },
        { status: 503 }
      );
    }

    // Return the error details for better debugging
    return NextResponse.json(
      { error: `Something went wrong: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
