/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { memo, useCallback, useEffect, useRef } from 'react';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import styled from 'styled-components';
import { ConsoleFooter } from './components/console_footer';
import { ConsoleHeader } from './components/console_header';
import type { CommandInputProps } from './components/command_input';
import { CommandInput } from './components/command_input';
import type { ConsoleProps } from './types';
import { ConsoleStateProvider } from './components/console_state';
import { useTestIdGenerator } from '../../hooks/use_test_id_generator';
import { useWithManagedConsole } from './components/console_manager/console_manager';
import { HistoryOutput } from './components/history_output';
import { SidePanelFlexItem } from './components/side_panel/side_panel_flex_item';

const ConsoleWindow = styled.div`
  height: 100%;
  background-color: ${({ theme: { eui } }) => eui.euiPageBackgroundColor};
  border: ${({ theme: { eui } }) => eui.euiBorderThin};
  border-radius: ${({ theme: { eui } }) => eui.euiBorderRadiusSmall};

  .layout {
    height: 100%;
    min-height: 300px;

    &-hideOverflow {
      overflow: hidden;
    }

    &-bottomBorder {
      border-bottom: ${({ theme: { eui } }) => eui.euiSizeS} solid
        ${({ theme: { eui } }) => eui.euiPageBackgroundColor};
    }

    &-container {
      padding: ${({ theme: { eui } }) => eui.euiSizeL} ${({ theme: { eui } }) => eui.euiSizeL}
        ${({ theme: { eui } }) => eui.euiSizeS} ${({ theme: { eui } }) => eui.euiSizeL};
    }

    &-header {
      border-bottom: 1px solid ${({ theme: { eui } }) => eui.euiColorLightShade};
    }

    &-footer,
    &-commandInput {
      padding-top: ${({ theme: { eui } }) => eui.euiSizeXS};
      padding-bottom: ${({ theme: { eui } }) => eui.euiSizeXS};
    }

    &-rightPanel {
      width: 35%;
      background-color: ${({ theme: { eui } }) => eui.euiFormBackgroundColor};
      border-left: ${({ theme: { eui } }) => eui.euiBorderThin};
    }

    &-historyOutput {
      overflow: auto;
    }

    &-historyViewport {
      height: 100%;
      overflow-x: hidden;
    }
  }

  //-----------------------------------------------------------
  // 👇 Utility classnames for use anywhere inside of Console
  //-----------------------------------------------------------

  .font-family-code {
    font-family: ${({ theme: { eui } }) => eui.euiCodeFontFamily};
  }

  .font-style-italic {
    font-style: italic;
  }

  .descriptionList-20_80 {
    &.euiDescriptionList {
      > .euiDescriptionList__title {
        width: 20%;
      }

      > .euiDescriptionList__description {
        width: 80%;
      }
    }
  }
`;

export const Console = memo<ConsoleProps>(
  ({ prompt, commands, HelpComponent, TitleComponent, managedKey, ...commonProps }) => {
    const scrollingViewport = useRef<HTMLDivElement | null>(null);
    const inputFocusRef: CommandInputProps['focusRef'] = useRef(null);
    const getTestId = useTestIdGenerator(commonProps['data-test-subj']);
    const managedConsole = useWithManagedConsole(managedKey);

    const scrollToBottom = useCallback(() => {
      // We need the `setTimeout` here because in some cases, the command output
      // will take a bit of time to populate its content due to the use of Promises
      setTimeout(() => {
        if (scrollingViewport.current) {
          scrollingViewport.current.scrollTop = scrollingViewport.current.scrollHeight;
        }
      }, 1);

      // NOTE: its IMPORTANT that this callback does NOT have any dependencies, because
      // it is stored in State and currently not updated if it changes
    }, []);

    const setFocusOnInput = useCallback(() => {
      if (inputFocusRef.current) {
        inputFocusRef.current.focus();
      }
    }, []);

    // When the console is shown, set focus to it so that user can just start typing
    useEffect(() => {
      if (!managedConsole || managedConsole.isOpen) {
        setTimeout(setFocusOnInput, 2);
      }
    }, [setFocusOnInput, managedConsole]);

    return (
      <ConsoleStateProvider
        commands={commands}
        scrollToBottom={scrollToBottom}
        keyCapture={inputFocusRef}
        managedKey={managedKey}
        HelpComponent={HelpComponent}
        dataTestSubj={commonProps['data-test-subj']}
      >
        <ConsoleWindow onClick={setFocusOnInput} {...commonProps}>
          <EuiFlexGroup
            direction="column"
            className="layout"
            gutterSize="none"
            responsive={false}
            data-test-subj={getTestId('mainPanel')}
          >
            <EuiFlexItem grow={false} className="layout-container layout-header">
              <ConsoleHeader TitleComponent={TitleComponent} />
            </EuiFlexItem>

            <EuiFlexItem grow className="layout-hideOverflow">
              <EuiFlexGroup gutterSize="none" responsive={false} className="layout-hideOverflow">
                <EuiFlexItem className="eui-fullHeight layout-hideOverflow">
                  <EuiFlexGroup
                    direction="column"
                    gutterSize="none"
                    responsive={false}
                    className="layout-hideOverflow"
                  >
                    <EuiFlexItem grow className="layout-historyOutput">
                      <div
                        className="layout-container layout-historyViewport eui-scrollBar eui-yScroll"
                        ref={scrollingViewport}
                      >
                        <HistoryOutput />
                      </div>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false} className="layout-container layout-commandInput">
                      <CommandInput prompt={prompt} focusRef={inputFocusRef} />
                    </EuiFlexItem>
                    <EuiFlexItem grow={false} className="layout-container layout-footer">
                      <ConsoleFooter />
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiFlexItem>

                {<SidePanelFlexItem />}
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </ConsoleWindow>
      </ConsoleStateProvider>
    );
  }
);
Console.displayName = 'Console';
