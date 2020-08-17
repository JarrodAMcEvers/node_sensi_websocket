import * as socketHelper from './socket_helper';
import * as config from '../config';
import * as socketIO from 'socket.io-client';

export class Socket {
  accessToken: string;
  socketConnection: any;

  constructor(accessToken) {
    this.accessToken = accessToken;
    this.socketConnection = null;
  }

  connectToSocket() {
    if (!this.socketConnection) {
      this.socketConnection = socketIO(
        config.socket_endpoint,
        {
          transports: ['websocket'],
          path: '/thermostat',
          extraHeaders: { Authorization: `Bearer ${this.accessToken}` }
        }
      );
    }
  }

  startSocketConnection() {
    this.connectToSocket();

    this.socketConnection.on('connected', () => {
      console.log('connected');
      this.socketConnection.on('state', socketHelper.stateHandler);
    });
    this.socketConnection.on('disconnect', socketHelper.disconnectHandler);
    this.socketConnection.on('error', socketHelper.errorHandler);

    return this.socketConnection;
  }
}