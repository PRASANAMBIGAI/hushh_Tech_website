import { describe, expect, it } from 'vitest';

import {
  buildVertexGenerateContentEndpoint,
  HUSHH_PROFILE_SEARCH_VERTEX_CONFIG,
  SHADOW_INVESTIGATOR_VERTEX_CONFIG,
} from '../supabase/functions/_shared/vertexEndpoints';
import {
  SHADOW_INVESTIGATOR_UNAUTHORIZED_MESSAGE,
  SHADOW_INVESTIGATOR_UNAVAILABLE_MESSAGE,
  createShadowInvestigatorUnauthorizedResponse,
  createShadowInvestigatorUpstreamErrorResponse,
} from '../supabase/functions/shadow-investigator/httpResponses';

describe('shadow investigator edge helpers', () => {
  it('builds the regional gemini-2.0-flash-001 endpoint for both shadow functions', () => {
    const shadowEndpoint = buildVertexGenerateContentEndpoint({
      projectId: 'hushone-app',
      ...SHADOW_INVESTIGATOR_VERTEX_CONFIG,
    });
    const profileSearchEndpoint = buildVertexGenerateContentEndpoint({
      projectId: 'hushone-app',
      ...HUSHH_PROFILE_SEARCH_VERTEX_CONFIG,
    });

    expect(shadowEndpoint).toBe(
      'https://us-central1-aiplatform.googleapis.com/v1/projects/hushone-app/locations/us-central1/publishers/google/models/gemini-2.0-flash-001:generateContent'
    );
    expect(profileSearchEndpoint).toBe(shadowEndpoint);
  });

  it('returns a 401 response for missing or invalid auth', async () => {
    const response = createShadowInvestigatorUnauthorizedResponse({
      'Access-Control-Allow-Origin': '*',
    });

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: SHADOW_INVESTIGATOR_UNAUTHORIZED_MESSAGE,
    });
  });

  it('returns a sanitized 502 response for upstream vertex failures', async () => {
    const response = createShadowInvestigatorUpstreamErrorResponse({
      'Access-Control-Allow-Origin': '*',
    });

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: SHADOW_INVESTIGATOR_UNAVAILABLE_MESSAGE,
    });
  });
});
