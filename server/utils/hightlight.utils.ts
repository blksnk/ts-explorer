import { createHighlighter, makeSingletonHighlighter } from "shiki";

const getHighlighter = makeSingletonHighlighter(createHighlighter);

/**
 * Highlights code using Shiki syntax highlighter with Catppuccin themes
 * @param code - The source code string to highlight
 * @returns Promise resolving to object containing highlighted HTML
 */
export const highlightCode = async (code: string) => {
  const highlighter = await getHighlighter({
    themes: ["catppuccin-latte", "catppuccin-mocha"],
    langs: ["typescript", "tsx", "javascript", "jsx"],
  });

  const html = await highlighter.codeToHtml(code, {
    lang: "tsx",
    themes: {
      light: "catppuccin-latte",
      dark: "catppuccin-mocha",
    },
  });

  return {
    html,
  };
};
