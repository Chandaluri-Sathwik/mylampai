import { NextRequest, NextResponse } from "next/server";
import textClient from "@/lib/text-to-speech";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) return NextResponse.json({
      message: "text is required"
    }, { status: 404 })

    const request = {
      input: { text },
      voice: {
        languageCode: "en-IN",
        ssmlGender: 'FEMALE' as "FEMALE" | "MALE" | "NEUTRAL",
        name: "en-IN-Journey-F"
      },
      audioConfig: { audioEncoding: 'MP3' as "MP3" }
    }

    const [response] = await textClient.synthesizeSpeech(request);

    return NextResponse.json({
      audioResponse: response.audioContent
    }, { status: 200 });

  } catch (error) {
    console.log("error: ", error);

    return NextResponse.json({
      message: "Internal server error"
    }, { status: 500 })
  }
}


export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
