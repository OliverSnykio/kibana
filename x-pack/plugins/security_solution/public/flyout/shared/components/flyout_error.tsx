/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiEmptyPrompt, EuiFlexItem } from '@elastic/eui';
import { ERROR_MESSAGE, ERROR_TITLE, FLYOUT_ERROR } from '../translations';
import { FLYOUT_ERROR_TEST_ID } from '../test_ids';

/**
 * Use this when you need to show an error state in the flyout
 */
export const FlyoutError: React.VFC = () => (
  <EuiFlexItem>
    <EuiEmptyPrompt
      iconType="error"
      color="danger"
      title={<h2>{ERROR_TITLE(FLYOUT_ERROR)}</h2>}
      body={<p>{ERROR_MESSAGE(FLYOUT_ERROR)}</p>}
      data-test-subj={FLYOUT_ERROR_TEST_ID}
    />
  </EuiFlexItem>
);

FlyoutError.displayName = 'FlyoutError';
