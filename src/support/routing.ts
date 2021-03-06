export class StaticRoute<D> {
  constructor(
    public pattern: string,
    public key: string,
    public load: (resolve: (mod: IStaticPageModule<D>) => void) => void
  ) { }
}

export class DynamicRoute<A, D> {
  constructor(
    public pattern: string,
    public key: string,
    public load: (resolve: (mod: IDynamicPageModule<A, D>) => void) => void
  ) { }
}

export function unwrapModule<A, B>(mod: { Page: A, fetchData: B }): { component: A, fetchData?: B } {
  return { component: mod.Page, fetchData: mod.fetchData };
}
