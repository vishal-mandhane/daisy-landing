import { api } from '../lib/browser.js';
import * as host from './host.js';

api.runtime.onMessage.addListener((msg, _sender, respond) => {
  if (!msg || msg.target !== 'sieve-offscreen') return;
  const fn = host[msg.type];
  if (!fn) {
    respond({ __error: `unknown offscreen call ${msg.type}` });
    return true;
  }
  fn(msg).then(respond, (err) => respond({ __error: String(err?.message ?? err) }));
  return true;
});
