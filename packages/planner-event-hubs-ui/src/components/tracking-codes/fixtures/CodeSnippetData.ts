import { AccountCodeSnippet, CodeSnippetStatus, UtmOverride } from '@cvent/planner-event-hubs-model/types';
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
    codeSnippetId: '3ce1554f-5ecc-4182-b838-e20ad46c8a7b',
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

export const utmTrackingParametersList: UtmOverride[] = [
  {
    key: 'key1',
    value: 'value1'
  },
  {
    key: 'key2',
    value: 'value2'
  }
];

export const utmTrackingParametersMaxList: UtmOverride[] = [
  {
    key: 'key1',
    value: 'value1'
  },
  {
    key: 'key2',
    value: 'value2'
  },
  {
    key: 'key3',
    value: 'value3'
  },
  {
    key: 'key4',
    value: 'value4'
  },
  {
    key: 'key5',
    value: 'value5'
  },
  {
    key: 'key6',
    value: 'value6'
  },
  {
    key: 'key7',
    value: 'value7'
  },
  {
    key: 'key8',
    value: 'value8'
  },
  {
    key: 'key9',
    value: 'value9'
  },
  {
    key: 'key10',
    value: 'value10'
  },
  {
    key: 'key11',
    value: 'value11'
  },
  {
    key: 'key12',
    value: 'value12'
  },
  {
    key: 'key13',
    value: 'value13'
  },
  {
    key: 'key14',
    value: 'value14'
  },
  {
    key: 'key15',
    value: 'value15'
  }
];
