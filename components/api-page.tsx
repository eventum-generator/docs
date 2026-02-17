import { createAPIPage } from 'fumadocs-openapi/ui';

import client from './api-page.client';
import { openapi } from '@/lib/openapi';

export const APIPage = createAPIPage(openapi, {
  client,
});
