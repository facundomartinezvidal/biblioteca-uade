import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// URL del Backoffice (Hardcoded o env var si prefieres)
const BACKOFFICE_API_URL =
  "https://backoffice-production-df78.up.railway.app/api/v1";

interface BackofficeParameter {
  id_parametro: string;
  nombre: string;
  tipo: "multa" | "sancion";
  valor_numerico: string; // Viene como string desde la API
  valor_texto: string | null;
  status: boolean;
}

// Helper para buscar parámetro en Backoffice
async function getParameterFromBackoffice(
  name: string,
): Promise<BackofficeParameter | null> {
  try {
    console.log(`Fetching parameter '${name}' from Backoffice...`);
    const res = await fetch(`${BACKOFFICE_API_URL}/parametros`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(`Backoffice API Error: ${res.status} ${res.statusText}`);
      return null;
    }

    const parameters = (await res.json()) as BackofficeParameter[];
    // Buscar parámetro activo por nombre
    const param = parameters.find(
      (p) => p.nombre === name && p.status === true,
    );

    return param || null;
  } catch (error) {
    console.error("Error fetching from Backoffice:", error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const appUrl =
      Deno.env.get("APP_URL") ?? "https://biblioteca-uade.vercel.app";

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const now = new Date();
    const twentyFourHoursFromNow = new Date(now);
    twentyFourHoursFromNow.setHours(now.getHours() + 24);

    // Helper to publish event
    const publishEventToApp = async (eventData: any) => {
      try {
        console.log("Publishing event to app:", eventData);
        await fetch(`${appUrl}/api/webhooks/rabbitmq`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
      } catch (err) {
        console.error("Failed to publish event:", err);
      }
    };

    // 1. Check for loans expiring soon (notifications)
    const { data: loansExpiringSoon } = await supabase
      .from("loans")
      .select("*")
      .eq("status", "ACTIVE")
      .gte("end_date", now.toISOString())
      .lte("end_date", twentyFourHoursFromNow.toISOString());

    if (loansExpiringSoon?.length) {
      const notifications = loansExpiringSoon.map((loan: any) => ({
        user_id: loan.user_id,
        type: "LOAN_DEADLINE",
        title: "Tu préstamo está por vencer",
        message: `Tu préstamo vence pronto. Devuélvelo antes de la fecha límite.`,
        loan_id: loan.id,
        read: false,
      }));

      await supabase.from("notifications").insert(notifications);
      console.log(
        `Created ${notifications.length} loan deadline notifications`,
      );
    }

    // 2. Check for expired loans
    const { data: expiredLoans } = await supabase
      .from("loans")
      .select("*")
      .eq("status", "ACTIVE")
      .lt("end_date", now.toISOString());

    if (expiredLoans?.length) {
      console.log(`Found ${expiredLoans.length} expired loans`);

      // 2a. Fetch "Devolución tardía" parameter from Backoffice
      const lateReturnParam =
        await getParameterFromBackoffice("Devolución tardía");

      if (!lateReturnParam) {
        console.error(
          "CRITICAL: Could not find 'Devolución tardía' parameter in Backoffice. Skipping penalty creation.",
        );
        // We still expire the loans, but can't create penalties without the ID
      }

      // Update loans to EXPIRED regardless of parameter fetch success
      await supabase
        .from("loans")
        .update({ status: "EXPIRED" })
        .in(
          "id",
          expiredLoans.map((l: any) => l.id),
        );

      // Create penalties ONLY if we found the parameter
      if (lateReturnParam) {
        const penalties = expiredLoans.map((loan: any) => ({
          user_id: loan.user_id,
          loan_id: loan.id,
          parameter_id: lateReturnParam.id_parametro,
          status: "PENDING",
          created_at: new Date().toISOString(),
        }));

        const { data: createdPenalties, error: penaltyError } = await supabase
          .from("user_parameters")
          .insert(penalties)
          .select();

        if (penaltyError) {
          console.error("Error creating penalties:", penaltyError);
        } else if (createdPenalties) {
          console.log(
            `Created ${createdPenalties.length} late return penalties`,
          );

          // Publish events
          for (const penalty of createdPenalties) {
            await publishEventToApp({
              type: "PENALTY_CREATED",
              data: {
                id: penalty.id,
                userId: penalty.user_id,
                parameterId: penalty.parameter_id,
                amount: lateReturnParam.valor_numerico, // Real amount from Backoffice
                status: penalty.status,
                createdAt: penalty.created_at,
                source: "AUTOMATIC_JOB",
              },
            });
          }

          // Create notifications
          const notifs = createdPenalties.map((p: any) => ({
            user_id: p.user_id,
            type: "PENALTY_APPLIED",
            title: "Multa aplicada",
            message: `Se te ha aplicado una multa de $${lateReturnParam.valor_numerico} por devolución tardía.`,
            penalty_id: p.id,
            loan_id: p.loan_id,
            read: false,
          }));
          await supabase.from("notifications").insert(notifs);
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
