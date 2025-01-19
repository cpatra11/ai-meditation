import { NextResponse } from "next/server";

export async function POST(request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const preferenceId = url.searchParams.get("preferenceId");

  console.log("GET /api/getMeditation");
  console.log("Received parameters:", { userId });

  if (!userId) {
    console.error("Missing parameters: userId or preferenceId");
    return new Response(
      JSON.stringify({ error: "userId or preferenceId is missing" }),
      { status: 400 }
    );
  }
  const email = "bhalu@cpun.com";
  const password = "123456";
  const loginResponse = await fetch(`${process.env.API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!loginResponse.ok) {
    const errorMessage = await loginResponse.text();
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

  // const expressApiUrl = `http://localhost:4000/api/audioo?userId=${userId}&preferenceId=${preferenceId}`;
  const expressApiUrl = `${process.env.API_URL}/api/audioo?userId=${userId}`;
  console.log("Express API URL:", expressApiUrl);

  try {
    console.log("Fetching audio from Express API...");
    const response = await fetch(expressApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({ userId }),
    });

    console.log(
      "Received response from Express API:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      console.error(
        "Failed to fetch audio from Express API. Status:",
        response.status,
        response.statusText
      );
      throw new Error(
        `Failed to fetch audio from Express API. Status: ${response.status}`
      );
    }

    const audioBlob = await response.blob();
    console.log("Received audio blob. Blob size:", audioBlob.size);

    const audioBuffer = await audioBlob.arrayBuffer();
    console.log(
      "Converted audio blob to array buffer. Buffer size:",
      audioBuffer.byteLength
    );

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mp3",
        "Content-Disposition": `attachment; filename=meditation-${preferenceId}.mp3`,
      },
    });
  } catch (error) {
    console.error(
      "Error occurred while fetching audio from Express API:",
      error
    );

    if (error instanceof TypeError) {
      console.error("Network or Fetch Error:", error.message);
    } else if (error instanceof SyntaxError) {
      console.error("Response Parsing Error:", error.message);
    } else {
      console.error("Unknown Error:", error.message);
    }

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
