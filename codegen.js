const ejs = require('ejs');
const fs = require('fs');
const yaml = require('js-yaml');
const _ = require('lodash');

const routeKeys = {};

const routes = yaml.safeLoad(fs.readFileSync('./src/routes.yml', 'utf-8')).map(route => {
  if (!routeKeys[route.page]) {
    routeKeys[route.page] = Object.keys(routeKeys).length.toString();
  }
  return {
    key: JSON.stringify(routeKeys[route.page]),
    path: JSON.stringify(route.path),
    page: JSON.stringify(route.page)
  };
});

fs.writeFileSync('./src/routes.ts', ejs.render(
  fs.readFileSync('./src/routes.ts.ejs', 'utf-8'),
  { routes }
));
