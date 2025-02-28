/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';

import type { ValidationConfig, ValidationFunc } from '../../shared_imports';
import { fieldValidators } from '../../shared_imports';
export { queryFieldValidation } from '../../common/validations';

const idPattern = /^[a-zA-Z0-9-_]+$/;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const idSchemaValidation: ValidationFunc<any, string, string> = ({ value }) => {
  const valueIsValid = idPattern.test(value);
  if (!valueIsValid) {
    return {
      message: i18n.translate('xpack.osquery.pack.queryFlyoutForm.invalidIdError', {
        defaultMessage: 'Characters must be alphanumeric, _, or -',
      }),
    };
  }
};

const createUniqueIdValidation = (ids: Set<string>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uniqueIdCheck: ValidationFunc<any, string, string> = ({ value }) => {
    if (ids.has(value)) {
      return {
        message: i18n.translate('xpack.osquery.pack.queryFlyoutForm.uniqueIdError', {
          defaultMessage: 'ID must be unique',
        }),
      };
    }
  };

  return uniqueIdCheck;
};

export const createIdFieldValidations = (ids: Set<string>) => [
  fieldValidators.emptyField(
    i18n.translate('xpack.osquery.pack.queryFlyoutForm.emptyIdError', {
      defaultMessage: 'ID is required',
    })
  ),
  idSchemaValidation,
  createUniqueIdValidation(ids),
];

export const intervalFieldValidations: Array<
  ValidationConfig<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    string,
    number
  >
> = [
  {
    validator: fieldValidators.numberGreaterThanField({
      than: 0,
      message: i18n.translate('xpack.osquery.pack.queryFlyoutForm.intervalFieldMinNumberError', {
        defaultMessage: 'A positive interval value is required',
      }),
    }),
  },
  {
    validator: fieldValidators.numberSmallerThanField({
      than: 604800,
      message: ({ than }) =>
        i18n.translate('xpack.osquery.pack.queryFlyoutForm.intervalFieldMaxNumberError', {
          defaultMessage: 'An interval value must be lower than {than}',
          values: { than },
        }),
    }),
  },
];
