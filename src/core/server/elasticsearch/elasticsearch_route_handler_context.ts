/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { KibanaRequest } from '../http';
import type { IScopedClusterClient } from './client';
import type { InternalElasticsearchServiceStart } from './types';

/**
 * Core's `elasticsearch` request handler context.
 * @public
 */
export interface ElasticsearchRequestHandlerContext {
  client: IScopedClusterClient;
}

/**
 * The {@link UiSettingsRequestHandlerContext} implementation.
 * @internal
 */
export class CoreElasticsearchRouteHandlerContext implements ElasticsearchRequestHandlerContext {
  #client?: IScopedClusterClient;

  constructor(
    private readonly elasticsearchStart: InternalElasticsearchServiceStart,
    private readonly request: KibanaRequest
  ) {}

  public get client() {
    if (this.#client == null) {
      this.#client = this.elasticsearchStart.client.asScoped(this.request);
    }
    return this.#client;
  }
}
