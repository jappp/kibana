/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { i18n } from '@kbn/i18n';
import React from 'react';
import { DEFAULT_PERCENTILE_THRESHOLD } from '../../../../common/correlations/constants';
import { ProcessorEvent } from '../../../../common/processor_event';
import { useApmParams } from '../../../hooks/use_apm_params';
import { useFetcher } from '../../../hooks/use_fetcher';
import { useSampleChartSelection } from '../../../hooks/use_sample_chart_selection';
import { useTheme } from '../../../hooks/use_theme';
import { useTimeRange } from '../../../hooks/use_time_range';
import { DurationDistributionChartData } from '../../shared/charts/duration_distribution_chart';
import { DurationDistributionChartWithScrubber } from '../../shared/charts/duration_distribution_chart_with_scrubber';

export function BackendOperationDistributionChart() {
  const { clearChartSelection, selectSampleFromChartSelection } =
    useSampleChartSelection();

  // there is no "current" event in the backend operation detail view
  const markerCurrentEvent = undefined;

  const euiTheme = useTheme();

  const {
    query: {
      backendName,
      spanName,
      environment,
      kuery,
      rangeFrom,
      rangeTo,
      sampleRangeFrom = 0,
      sampleRangeTo = 0,
    },
  } = useApmParams('/backends/operation');

  const selection: [number, number] | undefined =
    sampleRangeFrom >= 0 && sampleRangeTo > 0
      ? [sampleRangeFrom, sampleRangeTo]
      : undefined;

  const { start, end } = useTimeRange({ rangeFrom, rangeTo });

  const { status, data } = useFetcher(
    (callApmApi) => {
      return callApmApi('GET /internal/apm/backends/charts/distribution', {
        params: {
          query: {
            percentileThreshold: DEFAULT_PERCENTILE_THRESHOLD,
            backendName,
            spanName,
            environment,
            kuery,
            start,
            end,
          },
        },
      });
    },
    [backendName, spanName, environment, kuery, start, end]
  );

  const hasData =
    (data?.allSpansDistribution.overallHistogram?.length ?? 0) > 0 ||
    (data?.failedSpansDistribution.overallHistogram?.length ?? 0) > 0;

  const chartData: DurationDistributionChartData[] = [
    {
      areaSeriesColor: euiTheme.eui.euiColorVis1,
      histogram: data?.allSpansDistribution.overallHistogram ?? [],
      id: i18n.translate(
        'xpack.apm.backendOperationDistributionChart.allSpansLegendLabel',
        {
          defaultMessage: 'All spans',
        }
      ),
    },
    {
      areaSeriesColor: euiTheme.eui.euiColorVis7,
      histogram: data?.failedSpansDistribution?.overallHistogram ?? [],
      id: i18n.translate(
        'xpack.apm.backendOperationDistributionChart.failedSpansLegendLabel',
        {
          defaultMessage: 'Failed spans',
        }
      ),
    },
  ];

  const percentileThresholdValue =
    data?.allSpansDistribution.percentileThresholdValue;

  return (
    <DurationDistributionChartWithScrubber
      chartData={chartData}
      eventType={ProcessorEvent.span}
      hasData={hasData}
      onChartSelection={selectSampleFromChartSelection}
      onClearSelection={clearChartSelection}
      status={status}
      markerCurrentEvent={markerCurrentEvent}
      percentileThresholdValue={percentileThresholdValue}
      selection={selection}
    />
  );
}
