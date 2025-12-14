import amqp from "amqplib";
import type { Connection, Channel } from "amqplib";
import { randomUUID } from "node:crypto";

// Variables de entorno para la conexión RabbitMQ
const RABBITMQ_USER = process.env.RABBITMQ_DEFAULT_USER;
const RABBITMQ_PASS = process.env.RABBITMQ_DEFAULT_PASS;
const RABBITMQ_HOST = process.env.RABBITMQ_HOST;
const RABBITMQ_PORT = process.env.RABBITMQ_PORT;

// Construir la URI de conexión
const RABBITMQ_URI = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

// Configuración del Exchange
const EXCHANGE_NAME = "sanctions.event";
const EXCHANGE_TYPE = "topic";

let connection: Connection | null = null;
let channel: Channel | null = null;

export interface EventEnvelope {
  eventId: string;
  eventType: string;
  occurredAt: string;
  emittedAt: string;
  sourceModule: string;
  payload: unknown;
}

/**
 * Obtiene o crea una conexión a RabbitMQ
 */
async function getRabbitMQConnection(): Promise<{
  connection: Connection;
  channel: Channel;
}> {
  if (connection && channel) {
    return { connection, channel };
  }

  try {
    console.log("Conectando a RabbitMQ...", RABBITMQ_URI);
    const conn = await amqp.connect(RABBITMQ_URI);
    const ch = await conn.createChannel();

    connection = conn as unknown as Connection;
    channel = ch;

    // No intentamos afirmar el exchange porque el usuario no tiene permisos de configuración (403).
    // Asumimos que el exchange 'sanctions.event' ya fue creado por el equipo de Core.
    // await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
    //   durable: true,
    // });

    // Manejar cierre de conexión
    conn.on("close", () => {
      console.warn("Conexión a RabbitMQ cerrada");
      connection = null;
      channel = null;
    });

    conn.on("error", (err: unknown) => {
      console.error("Error en conexión RabbitMQ", err);
      connection = null;
      channel = null;
    });

    return { connection: conn as unknown as Connection, channel: ch };
  } catch (error) {
    console.error("Error conectando a RabbitMQ:", error);
    throw error;
  }
}

/**
 * Publica un evento en el exchange configurado
 * @param routingKey La clave de enrutamiento (ej: user_parameter.created)
 * @param message El objeto a enviar como mensaje JSON
 */
export async function publishEvent(routingKey: string, message: object) {
  try {
    const { channel } = await getRabbitMQConnection();

    const envelope: EventEnvelope = {
      eventId: randomUUID(),
      eventType: routingKey,
      occurredAt: new Date().toISOString(),
      emittedAt: new Date().toISOString(),
      sourceModule: "Biblioteca",
      payload: message,
    };

    console.log(
      "[RabbitMQ] Sending Envelope:",
      JSON.stringify(envelope, null, 2),
    );

    const buffer = Buffer.from(JSON.stringify(envelope));
    const published = channel.publish(EXCHANGE_NAME, routingKey, buffer, {
      persistent: true,
    });

    if (published) {
      console.log(
        `[RabbitMQ] Evento publicado: ${routingKey} en ${EXCHANGE_NAME}`,
      );
    } else {
      console.error(
        `[RabbitMQ] Falló la publicación del evento: ${routingKey}`,
      );
    }
    return published;
  } catch (error) {
    console.error(`[RabbitMQ] Error al publicar evento ${routingKey}:`, error);
    // No lanzar error para no interrumpir el flujo principal de la aplicación
    return false;
  }
}

export const RABBITMQ_ROUTING_KEYS = {
  PENALTY_CREATED: "sanctions.created",
  SANCTION_UPDATED: "sanctions.updated",
};
