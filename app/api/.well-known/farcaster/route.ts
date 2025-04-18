// Farcaster manifest required for mini-apps
export async function GET() {
  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE
    },
    frame: {
      version: process.env.NEXT_PUBLIC_VERSION || "next",
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "MiniTV",
      homeUrl: process.env.NEXT_PUBLIC_HOME_URL || "https://mini-tv.app",
      iconUrl: process.env.NEXT_PUBLIC_ICON_URL || "https://mini-tv.app/miniicon.png",
      imageUrl: process.env.NEXT_PUBLIC_IMAGE_URL || "https://mini-tv.app/splash.png",
      buttonTitle: process.env.NEXT_PUBLIC_BUTTON_TITLE || "MiniTV : AI Video Creator",
      splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE_URL || "https://mini-tv.app/miniicon.png",
      splashBackgroundColor: `#${process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "FFFFFF"}`,
      subtitle: "Transform images into videos with AI",
      description: "MiniTV lets you turn static images into dynamic videos using state-of-the-art AI. Built on Ohara by Story91.base.eth",
      primaryCategory: "art-creativity",
      tags: ["ai", "video", "image", "creation", "base"],
      webhookUrl: `${process.env.NEXT_PUBLIC_URL || "https://mini-tv.app"}/api/webhook`
    }
  });
} 