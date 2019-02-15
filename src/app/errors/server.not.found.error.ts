export class ServerNotFoundError extends Error {
  constructor() {
    super();
    this.message = 'Failed to find server.';
    this.name = 'SERVER_NOT_FOUND;'
  }
}
