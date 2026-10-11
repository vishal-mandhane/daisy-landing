// Runs after `react-scripts build` (see "build" in package.json).
//
// Writes a real HTML file for every page (build/index.html,
// build/how-it-works/index.html, ...) with the page already drawn and its own
// title, description and structured data. Search engines, AI assistants and
// link previews often don't run JavaScript, and an empty <div id="root"> tells
// them nothing. In the browser, src/index.js takes over this HTML (hydration),
// so people see exactly what crawlers see.
//
// Also writes build/sitemap.xml and build/llms.txt from the same data.
//
// Any failure exits non-zero, so a broken page fails the deploy instead of
// going live.

process.env.NODE_ENV = 'production'; // React's production server renderer
process.env.BABEL_ENV = 'test'; // babel-preset-react-app: CommonJS output for Node

const fs = require('fs');
const path = require('path');
const Module = require('module');
const babel = require('@babel/core');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src') + path.sep;
const build = path.join(root, 'build');

// Let Node require the app's own source: JSX and ES modules via the same Babel
// preset the app is built with; stylesheets are the browser's business.
const loadJs = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
  if (!filename.startsWith(src)) return loadJs(module, filename);
  const { code } = babel.transformFileSync(filename, {
    babelrc: false,
    configFile: false,
    presets: [require.resolve('babel-preset-react-app')],
  });
  module._compile(code, filename);
};
Module._extensions['.css'] = () => {};

const React = require('react');
const { renderToString } = require('react-dom/server');
const App = require(path.join(src, 'App.js')).default;
const seo = require(path.join(src, 'seo.js'));

const template = fs.readFileSync(path.join(build, 'index.html'), 'utf8');

// Tags the template carries as defaults for `npm start`; each page replaces them.
const PAGE_TAGS = [
  /<title>[\s\S]*?<\/title>/g,
  /<meta\s+name="description"[^>]*>/g,
  /<meta\s+property="og:[^"]*"[^>]*>/g,
  /<meta\s+name="twitter:[^"]*"[^>]*>/g,
  /<link\s+rel="canonical"[^>]*>/g,
  /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/g,
];

function renderPage(route) {
  const body = renderToString(React.createElement(App, { initialPath: route }));
  if (!body.includes('<h1')) throw new Error(`${route}: rendered without an <h1>`);

  let html = template;
  for (const re of PAGE_TAGS) html = html.replace(re, '');
  if (!html.includes('</head>') || !html.includes('<div id="root"></div>')) {
    throw new Error('build/index.html is not the template this script expects');
  }
  return html
    .replace('</head>', `${seo.headTags(route)}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

for (const route of seo.ROUTES) {
  const file = route === '/' ? path.join(build, 'index.html') : path.join(build, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, renderPage(route));
  console.log(`prerendered ${route.padEnd(16)} -> ${path.relative(root, file)}`);
}

fs.writeFileSync(path.join(build, 'sitemap.xml'), seo.sitemapXml());
fs.writeFileSync(path.join(build, 'llms.txt'), seo.llmsTxt());
console.log('wrote build/sitemap.xml, build/llms.txt');
