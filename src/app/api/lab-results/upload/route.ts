import {
  handleUpload,
  type HandleUploadBody,
} from "@vercel/blob/client";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;
const PET_ID_PATTERN = /^[a-zA-Z0-9_-]{1,80}$/;

export const runtime = "nodejs";

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function POST(request: Request) {
  let body: HandleUploadBody;

  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return Response.json({ error: "Invalid upload request." }, { status: 400 });
  }

  if (body.type === "blob.generate-client-token" && !isSameOrigin(request)) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const payload = clientPayload
          ? (JSON.parse(clientPayload) as { petId?: unknown })
          : {};
        const petId =
          typeof payload.petId === "string" ? payload.petId : "";

        if (!PET_ID_PATTERN.test(petId)) {
          throw new Error("Invalid pet identifier.");
        }

        if (!pathname.startsWith(`lab-results/${petId}/`)) {
          throw new Error("Invalid report pathname.");
        }

        return {
          allowedContentTypes: [...ALLOWED_CONTENT_TYPES],
          maximumSizeInBytes: MAX_FILE_SIZE,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ petId }),
        };
      },
      onUploadCompleted: async () => {
        // File metadata is attached to the pet profile by the client after
        // Vercel Blob confirms the private upload.
      },
    });

    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload could not be prepared.";
    return Response.json({ error: message }, { status: 400 });
  }
}
