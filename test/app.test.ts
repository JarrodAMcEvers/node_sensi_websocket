import * as faker from 'faker';

const socketObject = {
  on: jest.fn()
};
const mockSocket = jest.fn(() => socketObject);
jest.mock('socket.io-client', () => mockSocket);

const mockAuthorization = {
  getTokens: jest.fn()
};
jest.mock('../src/authorization', () => mockAuthorization);

const mockEndpoint = faker.internet.url();
const mockConfig = {
  socket_endpoint: mockEndpoint
};
jest.mock('../src/config', () => mockConfig);

const socketConnection = {
  on: jest.fn()
}
const mockSocketObject = {
  socketConnection
};
const socket = jest.fn().mockImplementation(() => mockSocketObject)
jest.mock('../src/socket', () => {
  return { Socket: socket };
});

import * as app from '../src/app';

describe('app', () => {
  describe('startSocketConnection', () => {
    beforeAll(() => {
      mockAuthorization.getTokens.mockResolvedValue({ access_token: faker.random.number({ min: 0, max: 1000 }) });
    });

    test('get access token for socket connection', async () => {
      await app.startSocketConnection();

      expect(mockAuthorization.getTokens).toHaveBeenCalled();
    });

    test('properly creates socket connection', async () => {
      const accessToken = faker.random.uuid();
      mockAuthorization.getTokens.mockResolvedValueOnce({ access_token: accessToken });

      await app.startSocketConnection();

      expect(socket).toBeCalledWith(accessToken);
    });

    test('sets up connected, disconnect, and error handlers', async () => {
      await app.startSocketConnection();

      expect(socketConnection.on).toBeCalledWith('connected', expect.any(Function));
      expect(socketConnection.on).toBeCalledWith('disconnect', expect.any(Function));
      expect(socketConnection.on).toBeCalledWith('error', expect.any(Function));
    });

    test('returns socket', async () => {
      const socketConnection = await app.startSocketConnection();

      expect(socketConnection).toEqual(mockSocketObject.socketConnection);
    });
  });
});
