/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useMemo } from 'react';
import type { CSSObject } from '@emotion/react';
import { useEuiTheme } from '../../hooks';

export const useStyles = () => {
  const { euiTheme } = useEuiTheme();

  const cached = useMemo(() => {
    const { size, font } = euiTheme;

    const titleSection: CSSObject = {
      marginBottom: size.l,
    };

    const titleActions: CSSObject = {
      marginLeft: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
    };

    const updatedAt: CSSObject = {
      marginRight: size.m,
    };

    const widgetBadge: CSSObject = {
      position: 'absolute',
      bottom: size.base,
      left: size.base,
      width: `calc(100% - ${size.xl})`,
      fontSize: size.m,
      lineHeight: '18px',
      padding: `${size.xs} ${size.s}`,
      display: 'flex',
    };

    const treeViewContainer: CSSObject = {
      position: 'relative',
      border: euiTheme.border.thin,
      borderRadius: euiTheme.border.radius.medium,
      padding: size.base,
      height: '500px',
    };

    const percentageWidgets: CSSObject = {
      marginBottom: size.l,
    };

    const percentageChartTitle: CSSObject = {
      marginRight: size.xs,
      display: 'inline',
      fontWeight: font.weight.bold,
    };

    return {
      titleSection,
      titleActions,
      updatedAt,
      widgetBadge,
      treeViewContainer,
      percentageWidgets,
      percentageChartTitle,
    };
  }, [euiTheme]);

  return cached;
};
