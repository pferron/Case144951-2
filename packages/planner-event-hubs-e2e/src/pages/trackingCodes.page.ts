import { ChainablePromiseElement } from 'webdriverio';

class TrackingCodesPage {
  get trackingCodesButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $("//a[contains(text(), 'Tracking Codes')]");
  }

  get addCodeSnippetsTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('h2[title="Select Code Snippet"]');
  }

  get trackingCodesTitle(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('h1[title="Tracking Codes"]');
  }

  get dismissStatusButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="code-snippets-alert-dismiss-button"]');
  }

  get dismissStatusButtonNew(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="tracking-codes-alert-form-success-dismiss-button"]');
  }

  get leaveButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="snippet-settings-configure-confirmation-cancel-button"]');
  }

  get cancelButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="snippet-settings-modal-cancel-button"]');
  }

  get doneButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="snippet-settings-modal-save-button"]');
  }

  get editPencilButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="code-snippets-edit-button"]');
  }

  get statusDeleteModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="code-snippets-alert"]');
  }

  get statusDeleteModalNew(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="tracking-codes-alert-form-success"]');
  }

  get statusSavedModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="code-snippets-alert"]');
  }

  get statusSavedModalNew(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="tracking-codes-alert-form-success"]');
  }

  get deleteConfirmationCancelButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="snippet-delete-confirmation-modal-cancel-button"]');
  }

  get deleteConfirmationDeleteButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="snippet-delete-confirmation-modal-delete-button"]');
  }

  get codeSnippetEditButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="code-snippet-action-0-menu-option-0"]');
  }

  get codeSnippetDeleteButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="code-snippet-list-table-action-0-menu-option-1"]');
  }

  get alwaysTrackButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="snippet-type-radio__div__ALL_PAGES"]');
  }

  get addToSinglePageYesButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="add-to-single-video-pages-radio__div__1"]');
  }

  get addToAllYesButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="where_does_it_run-radio__div__1"]');
  }

  get addCodeSnippetButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="add-code-snippets-button"]');
  }

  get snippetSettingConfirmationModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="snippet-settings-configure-confirmation"]');
  }

  get snippetDeleteConfirmationModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="snippet-delete-confirmation-modal"]');
  }

  get snippetSettingsModal(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="snippet-settings-modal"]');
  }

  get codeSnippetTableRow(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="code-snippet-table-row-0"]');
  }

  get rowActionButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="code-snippet-list-table-menu-action-0"]');
  }

  get codeSnippetNextButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('button[data-cvent-id="select-code-snippet-modal-next-button"]');
  }

  // URL tracking parameters
  get editPencilButtonUTP(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="tracking-parameters-edit-button"]');
  }

  get addParametersButtonUTP(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="add-tracking-parameters-btn"]');
  }

  get addParametersKeyInputUTP(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="tracking-parameter-key-form-input-key-input"]');
  }

  get addParametersValueInputUTP(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="tracking-parameter-key-form-input-value-input"]');
  }

  get radioOptionsToHandleDuplicateKeysUTP(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="duplicate-key-names-section"]');
  }

  get addParametersAddBtnUTP(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="add-tracking-parameters-save-button"]');
  }

  get parametersTableFirstRow(): ChainablePromiseElement<WebdriverIO.Element> {
    return $('[data-cvent-id="tracking-parameters-table-row-0"]');
  }
}
export default new TrackingCodesPage();
