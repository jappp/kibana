/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { PropsWithChildren, ReactNode } from 'react';
import React, { memo, useEffect } from 'react';
import { FormattedMessage } from '@kbn/i18n-react';
import { EuiSpacer } from '@elastic/eui';
import { UnsupportedMessageCallout } from './unsupported_message_callout';
import type { ParsedCommandInterface } from '../service/parsed_command_input';
import type { CommandDefinition, CommandExecutionComponentProps } from '../types';
import { CommandInputUsage } from './command_usage';
import { useDataTestSubj } from '../hooks/state_selectors/use_data_test_subj';
import { useTestIdGenerator } from '../../../hooks/use_test_id_generator';
import { ConsoleCodeBlock } from './console_code_block';

export type BadArgumentProps = PropsWithChildren<{
  parsedInput: ParsedCommandInterface;
  commandDefinition: CommandDefinition;
}>;

/**
 * Shows a bad argument error. The error message needs to be defined via the Command History Item's
 * `state.errorMessage`
 */
export const BadArgument = memo<CommandExecutionComponentProps<{}, { errorMessage: ReactNode }>>(
  ({ command, setStatus, store }) => {
    const getTestId = useTestIdGenerator(useDataTestSubj());

    useEffect(() => {
      setStatus('success');
    }, [setStatus]);

    return (
      <UnsupportedMessageCallout
        header={
          <ConsoleCodeBlock textColor="error">
            <FormattedMessage
              id="xpack.securitySolution.console.badArgument.title"
              defaultMessage="Unsupported argument"
            />
          </ConsoleCodeBlock>
        }
        data-test-subj={getTestId('badArgument')}
      >
        <>
          <div data-test-subj={getTestId('badArgument-message')}>{store.errorMessage}</div>
          <EuiSpacer size="s" />
          <div>
            <CommandInputUsage commandDef={command.commandDefinition} />
          </div>
          <div>
            <ConsoleCodeBlock>
              <FormattedMessage
                id="xpack.securitySolution.console.badArgument.helpMessage"
                defaultMessage="Enter {helpCmd} for further assistance."
                values={{
                  helpCmd: (
                    <ConsoleCodeBlock
                      bold
                      inline
                    >{`${command.commandDefinition.name} --help`}</ConsoleCodeBlock>
                  ),
                }}
              />
            </ConsoleCodeBlock>
          </div>
        </>
      </UnsupportedMessageCallout>
    );
  }
);
BadArgument.displayName = 'BadArgument';
