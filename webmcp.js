(function () {
  var tools = [
    {
      name: "open-human20-agent-page",
      description: "Open the Человек 2.0 agent/API setup page where a logged-in user can create or manage an MCP Bearer token.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false
      },
      execute: function () {
        window.location.assign("/agent");
        return {
          content: [
            { type: "text", text: "Opening https://human20.app/agent" }
          ]
        };
      }
    },
    {
      name: "search-human20-public-content",
      description: "Search public Человек 2.0 site sections by opening the relevant public page. This does not access private user data.",
      inputSchema: {
        type: "object",
        properties: {
          section: {
            type: "string",
            enum: ["skills", "pulse", "agent", "rules", "privacy"],
            description: "Public section to open."
          }
        },
        required: ["section"],
        additionalProperties: false
      },
      execute: function (input) {
        var section = input && input.section ? String(input.section) : "agent";
        var allowed = { skills: "/skills", pulse: "/pulse", agent: "/agent", rules: "/rules", privacy: "/privacy" };
        var path = allowed[section] || "/agent";
        window.location.assign(path);
        return {
          content: [
            { type: "text", text: "Opening https://human20.app" + path }
          ]
        };
      }
    },
    {
      name: "open-human20-mcp-endpoint",
      description: "Open the public MCP endpoint. Public onboarding is visible without a token; personal tools require a Bearer token issued from the site.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false
      },
      execute: function () {
        window.location.assign("/mcp");
        return {
          content: [
            { type: "text", text: "Opening https://human20.app/mcp" }
          ]
        };
      }
    }
  ];

  function provideHuman20WebMcp() {
    try {
      var modelContext = window.navigator && window.navigator.modelContext;
      if (!modelContext || typeof modelContext.provideContext !== "function") return false;
      modelContext.provideContext({ tools: tools });
      window.__human20WebMcpTools = tools.map(function (tool) { return tool.name; });
      return true;
    } catch (error) {
      window.__human20WebMcpError = error && error.message ? error.message : String(error);
      return false;
    }
  }

  window.__provideHuman20WebMcp = provideHuman20WebMcp;
  provideHuman20WebMcp();
  window.addEventListener("pageshow", provideHuman20WebMcp);
  window.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") provideHuman20WebMcp();
  });
})();
