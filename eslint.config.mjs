// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 1. Configuración recomendada por defecto de ESLint (la base)
  pluginJs.configs.recommended,

  // 2. Tu configuración personalizada Vento
  {
    // Define sobre qué archivos actúa
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],

    languageOptions: {
      // Define variables globales (document, window, process, etc.)
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },

    // 3. Las reglas Vento (Syntax & Style)
    rules: {
      // camelCase para variables y propiedades
      "camelcase": ["error", { 
      "properties": "never",         // Permite obj.last_names
      "ignoreDestructuring": true    // Permite const { last_names } = body
    }],

      // PascalCase para Clases (Constructores)
      "new-cap": ["error", { "newIsCap": true, "capIsNew": true, "capIsNewExceptions": ["Fastify"] }],
      "no-var": "error",
      "prefer-const": "error",
       "no-unused-vars": "off",
      "prefer-arrow-callback": "error",
      "semi": ["error", "always"],
      "no-warning-comments": ["warn", { 
          "terms": ["todo", "fixme"], 
          "location": "start" 
      }]
    },
  },
];