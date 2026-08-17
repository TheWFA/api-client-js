// dist/main is compiled to CommonJS, but the package's own "type": "module" would
// otherwise make Node treat every .js file in the package as ESM by default. This
// marks dist/main explicitly, so `require('@thewfa/api-client')` resolves correctly.
const fs = require('fs');

fs.writeFileSync('dist/main/package.json', JSON.stringify({ type: 'commonjs' }, null, 4) + '\n');
