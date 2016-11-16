/* tslint:disable:no-console */
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { createMemoryHistory, IHistory } from 'history';
import { Provider } from 'mobx-react';
// import { transaction } from 'mobx';
import { Store } from './stores';
import { Root } from './components/Root';
import { routes } from './serverRoutes';
import { checkAuth } from './support/auth';
import { promisedWhen } from './utils';

interface IResponse {
  status: (code: number) => void;
  send: (responseText: string) => void;
  redirect: (pathname: string) => void;
}

interface IRequest {
  url: string;
  cookies: {
    user: string;
  };
}

function createStore(path: string, authResult: { user: IUser, auth: IAuth } | null, history: IHistory): Store {
  const initialState = authResult ? {
    auth: {
      auth: authResult.auth,
      user: authResult.user,
    },
    routing: {
      path,
      data: null,
    },
  } : null;

  return new Store(initialState, {
    path,
    routes,
    history,
  });
}

export async function renderPage(baseUrl: string, req: IRequest, res: IResponse): Promise<void> {
  const authResult = await checkAuth(req.cookies.user || '');
  const history = createMemoryHistory();
  const store = createStore(req.url, authResult, history);

  await promisedWhen(() => store.routing.isReady || store.routing.isRedirected);

  if (store.routing.isRedirected && store.routing.redirectLocation) {
    res.redirect(store.routing.redirectLocation);
  }

  if (store.routing.isReady) {
    const html = renderToString(
      <Provider store={store} history={history}>
        <Root />
      </Provider>
    );

    res.status(store.routing.is404 ? 404 : 200);
    res.send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Webpack App</title>
    ${baseUrl === '/build/' ? `<link rel="stylesheet" href="${baseUrl}main.css" />` : ''}
  </head>
  <body>
    <div id="app">${html}</div>
    <script>window._store = ${JSON.stringify(store.toJSON())};</script>
    <script src="${baseUrl}main.js" async></script>
  </body>
</html>`);
  }
}
