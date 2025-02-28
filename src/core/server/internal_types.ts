/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { DocLinksServiceStart, DocLinksServiceSetup } from '@kbn/core-doc-links-server';
import {
  InternalLoggingServicePreboot,
  InternalLoggingServiceSetup,
} from '@kbn/core-logging-server-internal';
import type {
  AnalyticsServicePreboot,
  AnalyticsServiceSetup,
  AnalyticsServiceStart,
} from '@kbn/core-analytics-server';
import type { InternalEnvironmentServiceSetup } from '@kbn/core-environment-server-internal';
import type {
  InternalExecutionContextSetup,
  InternalExecutionContextStart,
} from '@kbn/core-execution-context-server-internal';
import { InternalPrebootServicePreboot } from '@kbn/core-preboot-server-internal';
import { CapabilitiesSetup, CapabilitiesStart } from './capabilities';
import { InternalContextPreboot, InternalContextSetup } from './context';
import {
  InternalElasticsearchServicePreboot,
  InternalElasticsearchServiceSetup,
  InternalElasticsearchServiceStart,
} from './elasticsearch';
import {
  InternalHttpServicePreboot,
  InternalHttpServiceSetup,
  InternalHttpServiceStart,
} from './http';
import {
  InternalSavedObjectsServiceSetup,
  InternalSavedObjectsServiceStart,
} from './saved_objects';
import {
  InternalUiSettingsServicePreboot,
  InternalUiSettingsServiceSetup,
  InternalUiSettingsServiceStart,
} from './ui_settings';
import { InternalMetricsServiceSetup, InternalMetricsServiceStart } from './metrics';
import { InternalRenderingServiceSetup } from './rendering';
import { InternalHttpResourcesPreboot, InternalHttpResourcesSetup } from './http_resources';
import { InternalStatusServiceSetup } from './status';
import { CoreUsageDataStart, InternalCoreUsageDataSetup } from './core_usage_data';
import { I18nServiceSetup } from './i18n';
import { InternalDeprecationsServiceSetup, InternalDeprecationsServiceStart } from './deprecations';

/** @internal */
export interface InternalCorePreboot {
  analytics: AnalyticsServicePreboot;
  context: InternalContextPreboot;
  http: InternalHttpServicePreboot;
  elasticsearch: InternalElasticsearchServicePreboot;
  uiSettings: InternalUiSettingsServicePreboot;
  httpResources: InternalHttpResourcesPreboot;
  logging: InternalLoggingServicePreboot;
  preboot: InternalPrebootServicePreboot;
}

/** @internal */
export interface InternalCoreSetup {
  analytics: AnalyticsServiceSetup;
  capabilities: CapabilitiesSetup;
  context: InternalContextSetup;
  docLinks: DocLinksServiceSetup;
  http: InternalHttpServiceSetup;
  elasticsearch: InternalElasticsearchServiceSetup;
  executionContext: InternalExecutionContextSetup;
  i18n: I18nServiceSetup;
  savedObjects: InternalSavedObjectsServiceSetup;
  status: InternalStatusServiceSetup;
  uiSettings: InternalUiSettingsServiceSetup;
  environment: InternalEnvironmentServiceSetup;
  rendering: InternalRenderingServiceSetup;
  httpResources: InternalHttpResourcesSetup;
  logging: InternalLoggingServiceSetup;
  metrics: InternalMetricsServiceSetup;
  deprecations: InternalDeprecationsServiceSetup;
  coreUsageData: InternalCoreUsageDataSetup;
}

/**
 * @internal
 */
export interface InternalCoreStart {
  analytics: AnalyticsServiceStart;
  capabilities: CapabilitiesStart;
  elasticsearch: InternalElasticsearchServiceStart;
  docLinks: DocLinksServiceStart;
  http: InternalHttpServiceStart;
  metrics: InternalMetricsServiceStart;
  savedObjects: InternalSavedObjectsServiceStart;
  uiSettings: InternalUiSettingsServiceStart;
  coreUsageData: CoreUsageDataStart;
  executionContext: InternalExecutionContextStart;
  deprecations: InternalDeprecationsServiceStart;
}
