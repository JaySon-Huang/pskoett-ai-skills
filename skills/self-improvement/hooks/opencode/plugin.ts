import type { Plugin } from "@opencode-ai/plugin";

const ERROR_PATTERNS = [
  "error:",
  "failed",
  "command not found",
  "no such file",
  "permission denied",
  "exception",
  "traceback",
  "npm err!",
  "syntaxerror",
  "typeerror",
  "non-zero",
];

const SYSTEM_REMINDER =
  "After non-obvious fixes, errors, or user corrections, log learnings in .learnings/ " +
  "(LEARNINGS.md, ERRORS.md, FEATURE_REQUESTS.md). Promote recurring patterns to persistent instructions.";

const SelfImprovementPlugin: Plugin = async () => {
  return {
    "experimental.chat.system.transform": async (_input, output) => {
      output.system.push(SYSTEM_REMINDER);
    },

    "tool.execute.after": async (input, output) => {
      if (input.tool !== "bash") return;

      const text = String(output.output ?? "");
      const lower = text.toLowerCase();
      const hasError = ERROR_PATTERNS.some((pattern) => lower.includes(pattern));

      if (!hasError) return;

      output.output = `${text}\n\n<error-detected>\nPotential command failure detected. If this required investigation or is likely to recur, log it to .learnings/ERRORS.md using the self-improvement format.\n</error-detected>`;
    },
  };
};

export default SelfImprovementPlugin;
export { SelfImprovementPlugin };
