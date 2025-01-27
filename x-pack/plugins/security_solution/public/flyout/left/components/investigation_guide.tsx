/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiLink, EuiLoadingSpinner } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n-react';
import { useInvestigationGuide } from '../../shared/hooks/use_investigation_guide';
import { useLeftPanelContext } from '../context';
import {
  INVESTIGATION_GUIDE_LOADING_TEST_ID,
  INVESTIGATION_GUIDE_NO_DATA_TEST_ID,
} from './test_ids';
import { InvestigationGuideView } from '../../../common/components/event_details/investigation_guide_view';

/**
 * Investigation guide displayed in the left panel.
 * Renders a message saying the guide hasn't been set up or the full investigation guide.
 */
export const InvestigationGuide: React.FC = () => {
  const { dataFormattedForFieldBrowser } = useLeftPanelContext();

  const { loading, error, basicAlertData, ruleNote } = useInvestigationGuide({
    dataFormattedForFieldBrowser,
  });

  if (loading) {
    return (
      <EuiFlexGroup
        justifyContent="spaceAround"
        data-test-subj={INVESTIGATION_GUIDE_LOADING_TEST_ID}
      >
        <EuiFlexItem grow={false}>
          <EuiLoadingSpinner size="m" />
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }

  return (
    <>
      {!error && basicAlertData.ruleId && ruleNote ? (
        <InvestigationGuideView
          basicData={basicAlertData}
          ruleNote={ruleNote}
          showTitle={false}
          showFullView={true}
        />
      ) : (
        <div data-test-subj={INVESTIGATION_GUIDE_NO_DATA_TEST_ID}>
          <FormattedMessage
            id="xpack.securitySolution.flyout.investigationGuideNoData"
            defaultMessage="There’s no investigation guide for this rule. {documentation} to add one."
            values={{
              documentation: (
                <EuiLink
                  href="https://www.elastic.co/guide/en/security/current/rules-ui-management.html#edit-rules-settings"
                  target="_blank"
                >
                  <FormattedMessage
                    id="xpack.securitySolution.flyout.documentDetails.investigationGuideDocumentationLink"
                    defaultMessage="Edit the rule's settings"
                  />
                </EuiLink>
              ),
            }}
          />
        </div>
      )}
    </>
  );
};

InvestigationGuide.displayName = 'InvestigationGuide';
