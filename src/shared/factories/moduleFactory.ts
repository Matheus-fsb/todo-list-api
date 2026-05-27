export class DependenceFactory<TDependencies, TService, TController> {
  public readonly dependencies: TDependencies;
  public readonly service: TService;
  public readonly controller: TController;

  constructor(
    dependencies: TDependencies,

    ServiceClass: new (dependencies: TDependencies) => TService,

    ControllerClass: new (service: TService) => TController,
  ) {
    this.dependencies = dependencies;

    this.service = new ServiceClass(this.dependencies);

    this.controller = new ControllerClass(this.service);
  }

  getController(): TController {
    return this.controller;
  }
}
