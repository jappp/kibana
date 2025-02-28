/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import * as t from 'io-ts';
import { Logger } from '@kbn/core/server';
import { setupRequest, Setup } from '../../lib/helpers/setup_request';
import { getPageLoadDistribution } from './get_page_load_distribution';
import { getPageLoadDistBreakdown } from './get_pl_dist_breakdown';
import { createApmServerRoute } from '../apm_routes/create_apm_server_route';
import { rangeRt } from '../default_api_types';
import { APMRouteHandlerResources } from '../typings';
import { UxUIFilters } from '../../../common/ux_ui_filter';

export type SetupUX = Setup & {
  uiFilters: UxUIFilters;
};

interface SetupRequestParams {
  query: {
    _inspect?: boolean;

    /**
     * Timestamp in ms since epoch
     */
    start?: number;

    /**
     * Timestamp in ms since epoch
     */
    end?: number;
  };
}

type SetupUXRequestParams = Omit<SetupRequestParams, 'query'> & {
  query: SetupRequestParams['query'] & {
    uiFilters?: string;
  };
};

export const percentileRangeRt = t.partial({
  minPercentile: t.string,
  maxPercentile: t.string,
});

const uiFiltersRt = t.type({ uiFilters: t.string });

const uxQueryRt = t.intersection([
  uiFiltersRt,
  rangeRt,
  t.partial({ urlQuery: t.string, percentile: t.string }),
]);

const rumPageLoadDistributionRoute = createApmServerRoute({
  endpoint: 'GET /internal/apm/ux/page-load-distribution',
  params: t.type({
    query: t.intersection([uxQueryRt, percentileRangeRt]),
  }),
  options: { tags: ['access:apm'] },
  handler: async (
    resources
  ): Promise<{
    pageLoadDistribution: {
      pageLoadDistribution: Array<{ x: number; y: number }>;
      percentiles: Record<string, number | null> | undefined;
      minDuration: number;
      maxDuration: number;
    } | null;
  }> => {
    const setup = await setupUXRequest(resources);

    const {
      query: { minPercentile, maxPercentile, urlQuery, start, end },
    } = resources.params;

    const pageLoadDistribution = await getPageLoadDistribution({
      setup,
      minPercentile,
      maxPercentile,
      urlQuery,
      start,
      end,
    });

    return { pageLoadDistribution };
  },
});

const rumPageLoadDistBreakdownRoute = createApmServerRoute({
  endpoint: 'GET /internal/apm/ux/page-load-distribution/breakdown',
  params: t.type({
    query: t.intersection([
      uxQueryRt,
      percentileRangeRt,
      t.type({ breakdown: t.string }),
    ]),
  }),
  options: { tags: ['access:apm'] },
  handler: async (
    resources
  ): Promise<{
    pageLoadDistBreakdown:
      | Array<{ name: string; data: Array<{ x: number; y: number }> }>
      | undefined;
  }> => {
    const setup = await setupUXRequest(resources);

    const {
      query: { minPercentile, maxPercentile, breakdown, urlQuery, start, end },
    } = resources.params;

    const pageLoadDistBreakdown = await getPageLoadDistBreakdown({
      setup,
      minPercentile: Number(minPercentile),
      maxPercentile: Number(maxPercentile),
      breakdown,
      urlQuery,
      start,
      end,
    });

    return { pageLoadDistBreakdown };
  },
});

function decodeUiFilters(
  logger: Logger,
  uiFiltersEncoded?: string
): UxUIFilters {
  if (!uiFiltersEncoded) {
    return {};
  }
  try {
    return JSON.parse(uiFiltersEncoded);
  } catch (error) {
    logger.error(error);
    return {};
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function setupUXRequest<TParams extends SetupUXRequestParams>(
  resources: APMRouteHandlerResources & { params: TParams }
) {
  const setup = await setupRequest(resources);
  return {
    ...setup,
    uiFilters: decodeUiFilters(
      resources.logger,
      resources.params.query.uiFilters
    ),
  };
}

export const rumRouteRepository = {
  ...rumPageLoadDistributionRoute,
  ...rumPageLoadDistBreakdownRoute,
};
