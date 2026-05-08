export default {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      // Enforce Conventional Commits header and capture type/scope/subject
      headerPattern: /^(\w+)(?:\(([^)]+)\))?!?:\s(.+)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
  rules: {
    // Type before ':' must be lowercase (feat, fix, docs, etc.)
    'type-case': [2, 'always', 'lower-case'],
    // Subject after ':' can be lowercase or uppercase formats
    'subject-case': [2, 'always', ['lower-case', 'sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    // Disable line length limits
    'body-max-line-length': [0, 'always', Infinity],
    'footer-max-line-length': [0, 'always', Infinity],
    // Allowed commit types (aligned with project standards)
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New functionality
        'fix',      // Bug fixes
        'docs',     // Documentation changes
        'refactor', // Code changes without adding features or fixing bugs
        'wip',      // Work in progress (exception for cross-machine work)
      ],
    ],
  },
  ignores: [
    // Ignore merge commits
    (message) => message.includes('Merge'),
  ],
};
