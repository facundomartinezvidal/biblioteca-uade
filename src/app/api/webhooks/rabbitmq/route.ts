import { type NextRequest, NextResponse } from "next/server";
import { publishEvent, RABBITMQ_ROUTING_KEYS } from "~/lib/rabbitmq";

interface WebhookBody {
  type: string;
  data: object;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as WebhookBody;

    // Validate event type
    if (body.type === "PENALTY_CREATED") {
      const success = await publishEvent(
        RABBITMQ_ROUTING_KEYS.PENALTY_CREATED,
        body.data,
      );

      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          { error: "Failed to publish event" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ error: "Unknown event type" }, { status: 400 });
  } catch (error) {
    console.error("Error in RabbitMQ webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
