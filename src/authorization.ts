import * as config from './config';
import {Tokens} from './types';
import * as request from 'request';
import * as util from 'util';

const post = util.promisify(request.post);

export async function getTokens(): Promise<Tokens> {
  const response = await post(
    `${config.token_endpoint}/token`,
    {
      form: {
        grant_type: 'password',
        client_id: config.client_id,
        client_secret: config.client_secret,
        username: config.username,
        password: config.password
      }
    }
  );

  const body = JSON.parse(response.body);
  if (response.statusCode === 400) {
    return Promise.reject(body);
  }
  return <Tokens>{access_token: body.access_token, refresh_token: body.refresh_token};
};