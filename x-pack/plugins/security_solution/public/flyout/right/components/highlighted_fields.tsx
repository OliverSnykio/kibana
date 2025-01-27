/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { FC } from 'react';
import React, { useMemo } from 'react';
import type { EuiBasicTableColumn } from '@elastic/eui';
import { EuiFlexGroup, EuiFlexItem, EuiInMemoryTable, EuiPanel, EuiTitle } from '@elastic/eui';
import { getSourcererScopeId } from '../../../helpers';
import { convertHighlightedFieldsToTableRow } from '../../shared/utils/highlighted_fields_helpers';
import { useRuleWithFallback } from '../../../detection_engine/rule_management/logic/use_rule_with_fallback';
import { useBasicDataFromDetailsData } from '../../../timelines/components/side_panel/event_details/helpers';
import { HighlightedFieldsCell } from './highlighted_fields_cell';
import {
  CellActionsMode,
  SecurityCellActions,
  SecurityCellActionsTrigger,
} from '../../../common/components/cell_actions';
import { HIGHLIGHTED_FIELDS_DETAILS_TEST_ID, HIGHLIGHTED_FIELDS_TITLE_TEST_ID } from './test_ids';
import {
  HIGHLIGHTED_FIELDS_FIELD_COLUMN,
  HIGHLIGHTED_FIELDS_TITLE,
  HIGHLIGHTED_FIELDS_VALUE_COLUMN,
} from './translations';
import { useRightPanelContext } from '../context';
import { useHighlightedFields } from '../../shared/hooks/use_highlighted_fields';

export interface HighlightedFieldsTableRow {
  /**
   * Highlighted field name (overrideField or if null, falls back to id)
   */
  field: string;
  description: {
    /**
     * Highlighted field name (overrideField or if null, falls back to id)
     */
    field: string;
    /**
     * Highlighted field value
     */
    values: string[] | null | undefined;
    /**
     * Maintain backwards compatibility // TODO remove when possible
     */
    scopeId: string;
  };
}

const columns: Array<EuiBasicTableColumn<HighlightedFieldsTableRow>> = [
  {
    field: 'field',
    name: HIGHLIGHTED_FIELDS_FIELD_COLUMN,
    'data-test-subj': 'fieldCell',
    width: '50%',
  },
  {
    field: 'description',
    name: HIGHLIGHTED_FIELDS_VALUE_COLUMN,
    'data-test-subj': 'valueCell',
    width: '50%',
    render: (description: {
      field: string;
      values: string[] | null | undefined;
      scopeId: string;
    }) => (
      <SecurityCellActions
        data={{
          field: description.field,
          value: description.values,
        }}
        mode={CellActionsMode.HOVER_RIGHT}
        triggerId={SecurityCellActionsTrigger.DEFAULT} // TODO use SecurityCellActionsTrigger.DETAILS_FLYOUT when https://github.com/elastic/kibana/issues/155243 is fixed
        visibleCellActions={5} // TODO use 6 when https://github.com/elastic/kibana/issues/155243 is fixed
        sourcererScopeId={getSourcererScopeId(description.scopeId)}
        metadata={{ scopeId: description.scopeId }}
      >
        <HighlightedFieldsCell values={description.values} field={description.field} />
      </SecurityCellActions>
    ),
  },
];

/**
 * Component that displays the highlighted fields in the right panel under the Investigation section.
 */
export const HighlightedFields: FC = () => {
  const { dataFormattedForFieldBrowser, scopeId } = useRightPanelContext();
  const { ruleId } = useBasicDataFromDetailsData(dataFormattedForFieldBrowser);
  const { rule: maybeRule } = useRuleWithFallback(ruleId);

  const highlightedFields = useHighlightedFields({
    dataFormattedForFieldBrowser,
    investigationFields: maybeRule?.investigation_fields?.field_names ?? [],
  });
  const items = useMemo(
    () => convertHighlightedFieldsToTableRow(highlightedFields, scopeId),
    [highlightedFields, scopeId]
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <EuiFlexGroup direction="column" gutterSize="s">
      <EuiFlexItem data-test-subj={HIGHLIGHTED_FIELDS_TITLE_TEST_ID}>
        <EuiTitle size="xxs">
          <h5>{HIGHLIGHTED_FIELDS_TITLE}</h5>
        </EuiTitle>
      </EuiFlexItem>
      <EuiFlexItem data-test-subj={HIGHLIGHTED_FIELDS_DETAILS_TEST_ID}>
        <EuiPanel hasBorder hasShadow={false}>
          <EuiInMemoryTable items={items} columns={columns} compressed />
        </EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
