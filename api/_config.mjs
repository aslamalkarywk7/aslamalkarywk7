/**
 * Assistant configuration — one switch for the whole feature set.
 *
 *   SCOPE = "personal"  → the website assistant only knows things about Islam:
 *                         profile, stack, experience, education, certificates,
 *                         services, work, contact — and can look them up in the
 *                         portfolio's own documentation.
 *                         No planning, no project templates, no live counters.
 *
 *   SCOPE = "full"      → everything, including project planning, the
 *                         deliverable project templates and the live GitHub
 *                         numbers (and the plan-mode button in the chat).
 *
 * Flip it here and restart the server. The browser learns the active scope
 * from GET /api/config, so no client change is needed.
 *
 * The MCP server (mcp/server.mjs) is the owner's own client and always gets
 * the complete tool set — it passes `{ scope: "full" }` explicitly.
 */

export const SCOPE = "personal";

const PERSONAL_TOOLS = [
  "get_profile",
  "list_certificates",
  "get_services",
  "get_featured_work",
  "get_contact_channels",
  "search_portfolio_docs",
];

const FULL_TOOLS = [
  ...PERSONAL_TOOLS,
  "get_project_templates",
  "get_live_github_stats",
  "record_plan",
];

export const SCOPES = {
  personal: {
    id: "personal",
    tools: PERSONAL_TOOLS,
    planMode: false,
    label: "Personal information only",
  },
  full: {
    id: "full",
    tools: FULL_TOOLS,
    planMode: true,
    label: "Full assistant (tools + planning + live stats)",
  },
};

export const ACTIVE = SCOPES[SCOPE] || SCOPES.personal;

/** Tool names allowed in the active scope. */
export function allowedTools(scope = SCOPE) {
  return (SCOPES[scope] || SCOPES.personal).tools;
}

/** Is a given tool available in this scope? */
export function toolAllowed(name, scope = SCOPE) {
  return allowedTools(scope).includes(name);
}

/** The payload the browser needs to configure itself. */
export function publicConfig() {
  return {
    scope: ACTIVE.id,
    scope_label: ACTIVE.label,
    plan_mode: ACTIVE.planMode,
    tools: ACTIVE.tools,
  };
}
