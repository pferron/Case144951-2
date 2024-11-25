import { AccountCodeSnippet, CodeSnippetStatus } from '@cvent/planner-event-hubs-model/types';
import { HubCodeSnippet } from '@components/tracking-codes/TrackingCodes';

export const accountCodeSnippet: AccountCodeSnippet[] = [
  {
    codeSnippetDataTagCode: 'TEST',
    codeSnippetId: 'Test-code-snippet-id',
    codeSnippetName: 'Test-code-snippet',
    codeSnippetStatus: CodeSnippetStatus.Approved,
    codeSnippetValue: '<script>',
    isDropCodeSnippetToCookieBannerTied: true
  },
  {
    codeSnippetDataTagCode: 'TEST2',
    codeSnippetId: '845cd4c1-98b1-48bf-815a-88921cc31e44',
    codeSnippetName: 'Marketo2',
    codeSnippetStatus: CodeSnippetStatus.Approved,
    codeSnippetValue: '<script>',
    isDropCodeSnippetToCookieBannerTied: true
  }
];

export const codeSnippets: HubCodeSnippet[] = [
  {
    codeSnippetId: 'Test-code-snippet-id',
    name: 'Test-code-snippet',
    dataTagCode: 'EP-TA',
    status: 'Approved',
    disableCodeSnippets: 'Yes',
    applicableOn: 'INITIALIZATION',
    addToAllPages: true,
    addToLoginPage: true,
    addToSingleVideoPage: true
  },
  {
    codeSnippetId: 'Test-code-snippet-id-2',
    name: 'Marketo',
    dataTagCode: 'TEST',
    status: 'Approved',
    disableCodeSnippets: 'Yes',
    applicableOn: 'INITIALIZATION',
    addToAllPages: true,
    addToLoginPage: false,
    addToSingleVideoPage: false
  }
];

export const codeSnippetsDataList: HubCodeSnippet[] = [
  {
    codeSnippetId: 'Test-code-snippet-id',
    name: 'Test-code-snippet',
    dataTagCode: 'EP-TA',
    status: 'Approved',
    disableCodeSnippets: 'Yes',
    applicableOn: 'INITIALIZATION',
    addToAllPages: true,
    addToLoginPage: true,
    addToSingleVideoPage: true
  }
];
