/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export const ROOT_PATH = '/';

export const SETUP_GUIDE_PATH = '/setup_guide';

export const SEARCH_INDICES_PATH = `${ROOT_PATH}search_indices`;
export const SETTINGS_PATH = `${ROOT_PATH}settings`;

export const NEW_INDEX_PATH = `${SEARCH_INDICES_PATH}/new_index`;
export const NEW_API_PATH = `${NEW_INDEX_PATH}/api`;
export const NEW_ES_INDEX_PATH = `${NEW_INDEX_PATH}/elasticsearch`;
export const NEW_DIRECT_UPLOAD_PATH = `${NEW_INDEX_PATH}/upload`;

export const SEARCH_INDEX_PATH = `${SEARCH_INDICES_PATH}/:indexName`;
export const SEARCH_INDEX_TAB_PATH = `${SEARCH_INDEX_PATH}/:tabId`;
