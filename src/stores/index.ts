/* tslint:disable:no-console */
import { Auth } from './auth';
import { IHistory } from 'history';
import { Routing } from './routing';
import { StaticRoute, DynamicRoute } from '../support/routing';
import { IAction } from '../support/actions';

interface IStoreOptions {
  path: string;
  routes: Array<StaticRoute<{}> | DynamicRoute<{}, {}>>;
  history: IHistory;
};

export class Store {
  public readonly auth: Auth;
  public readonly routing: Routing;
  public readonly history: IHistory;

  constructor(options: IStoreOptions) {
    this.auth = new Auth();
    this.routing = new Routing(options.path, options.routes, this);
    this.history = options.history;

    this.history.listen(location => {
      this.routing.path = location.pathname;
    });
  }

  public emit<T>(action: IAction<T>): T {
    console.debug('%cEMIT', 'font-weight: bold; color: white; background: black; padding: 2px 3px 0 3px', action);
    return action.react(this);
  }
}
