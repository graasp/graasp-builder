/**
 * Mock WebSocket class for Graasp WS protocol
 */

// eslint-disable-next-line import/prefer-default-export
export class WebSocket {
  constructor() {
    this.CLOSED = 0;
    this.OPEN = 1;

    this.readyState = this.OPEN;

    this.send = this.send.bind(this);
    this.receive = this.receive.bind(this);
    this.addEventListener = this.addEventListener.bind(this);
  }

  send(msg) {
    const req = JSON.parse(msg);
    // acknowledge request
    if (req.action.includes('subscribe')) {
      const res = {
        data: JSON.stringify({
          realm: 'notif',
          type: 'response',
          status: 'success',
          request: req,
        }),
      };
      this.onmessage(res);
    }
  }

  receive(msg) {
    const event = {
      data: JSON.stringify(msg),
    };
    this.onmessage(event);
  }

  addEventListener(event, handler) {
    this[`on${event}`] = handler;
    if (event === 'open') {
      handler();
    }
  }
}
