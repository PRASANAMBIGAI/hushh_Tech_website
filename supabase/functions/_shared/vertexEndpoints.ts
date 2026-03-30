export interface VertexModelConfig {
  location: string;
  modelId: string;
}

export const SHADOW_INVESTIGATOR_VERTEX_CONFIG: VertexModelConfig = {
  location: "us-central1",
  modelId: "gemini-2.0-flash-001",
};

export const HUSHH_PROFILE_SEARCH_VERTEX_CONFIG: VertexModelConfig = {
  location: "us-central1",
  modelId: "gemini-2.0-flash-001",
};

export const buildVertexGenerateContentEndpoint = ({
  projectId,
  location,
  modelId,
}: VertexModelConfig & { projectId: string }) =>
  `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:generateContent`;
