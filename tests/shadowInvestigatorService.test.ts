import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const getSessionMock = vi.fn();
const originalFetch = globalThis.fetch;

const baseParams = {
  name: 'Ankit Singh',
  email: 'ankit@example.com',
  contact: '+91 9876543210',
};

const loadService = async () => {
  vi.resetModules();
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
  vi.doMock('../src/resources/resources', () => ({
    default: {
      config: {
        supabaseClient: {
          auth: {
            getSession: (...args: unknown[]) => getSessionMock(...args),
          },
        },
      },
    },
  }));

  return import('../src/services/shadowInvestigator/index');
};

describe('invokeShadowInvestigator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    globalThis.fetch = originalFetch;
  });

  it('fails fast when there is no authenticated session token', async () => {
    getSessionMock.mockResolvedValue({
      data: {
        session: null,
      },
    });

    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as typeof fetch;

    const { invokeShadowInvestigator } = await loadService();
    const result = await invokeShadowInvestigator(baseParams);

    expect(result).toEqual({
      success: false,
      error: 'Please sign in again to generate your shadow profile.',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends the bearer token and returns the sanitized api error message', async () => {
    getSessionMock.mockResolvedValue({
      data: {
        session: {
          access_token: 'token-123',
        },
      },
    });

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ error: 'Unauthorized - invalid or expired session' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
    globalThis.fetch = fetchMock as typeof fetch;

    const { invokeShadowInvestigator } = await loadService();
    const result = await invokeShadowInvestigator(baseParams);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.supabase.co/functions/v1/shadow-investigator',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-123',
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(result).toEqual({
      success: false,
      error: 'Unauthorized - invalid or expired session',
    });
  });
});
