export const SHADOW_INVESTIGATOR_UNAUTHORIZED_MESSAGE =
  "Unauthorized - valid user session required";

export const SHADOW_INVESTIGATOR_UNAVAILABLE_MESSAGE =
  "Shadow profile generation is temporarily unavailable. Please try again.";

export const createShadowInvestigatorUnauthorizedResponse = (
  corsHeaders: HeadersInit,
  message = SHADOW_INVESTIGATOR_UNAUTHORIZED_MESSAGE,
) =>
  new Response(
    JSON.stringify({
      success: false,
      error: message,
    }),
    {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );

export const createShadowInvestigatorUpstreamErrorResponse = (
  corsHeaders: HeadersInit,
  message = SHADOW_INVESTIGATOR_UNAVAILABLE_MESSAGE,
) =>
  new Response(
    JSON.stringify({
      success: false,
      error: message,
    }),
    {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
