import { gql } from '@apollo/client';

export const getPageQuery = gql`
  query getPage($input: HubSearch!) {
    getPage(input: $input) {
      page {
        pageId
        videoCenterId
        status
        sectionIds
      }
      sections {
        sectionId
        originPageId
        pageSectionTemplate
        title
        visibleFields
        contentLimitOnInitialLoad
        featuredContentType
        featuredContentTypeId
        contentType
        contentIds
        contentFilterType
        contentFilterDateAbstract
        alignment
        layout
        textBody
        textColor
        buttonEnabled
        buttonText
        buttonExternalTarget
        buttonInternalTarget
        buttonTargetType
        imageUrl
        originalImageUrl
        imageAltText
      }
    }
  }
`;

export const createPageMutation = gql`
  mutation createPage($page: PageInput!, $newSection: PageSectionInput) {
    createPage(page: $page, newSection: $newSection) {
      page {
        pageId
        videoCenterId
        status
        sectionIds
      }
      newSection {
        sectionId
        originPageId
        pageSectionTemplate
        title
        visibleFields
        contentLimitOnInitialLoad
        featuredContentType
        featuredContentTypeId
        contentType
        contentIds
        contentFilterType
        contentFilterDateAbstract
        alignment
        layout
        textBody
        textColor
        buttonEnabled
        buttonText
        buttonExternalTarget
        buttonInternalTarget
        buttonTargetType
        imageUrl
        originalImageUrl
        imageAltText
      }
    }
  }
`;

export const updatePageMutation = gql`
  mutation updatePage($data: PageInput!) {
    updatePage(data: $data) {
      pageId
      videoCenterId
      status
      sectionIds
    }
  }
`;

export const createSectionMutation = gql`
  mutation createSection($data: PageSectionInput!, $input: HubSearch!) {
    createSection(input: $input, data: $data) {
      sectionId
      originPageId
      pageSectionTemplate
      title
      visibleFields
      contentLimitOnInitialLoad
      featuredContentType
      featuredContentTypeId
      contentType
      contentIds
      contentFilterType
      contentFilterDateAbstract
      alignment
      layout
      textBody
      textColor
      buttonEnabled
      buttonText
      buttonExternalTarget
      buttonInternalTarget
      buttonTargetType
      imageUrl
      originalImageUrl
      imageAltText
    }
  }
`;

export const updateSectionMutation = gql`
  mutation updateSection($data: PageSectionInput!, $input: HubSearch!) {
    updateSection(input: $input, data: $data) {
      sectionId
      originPageId
      pageSectionTemplate
      title
      visibleFields
      contentLimitOnInitialLoad
      featuredContentType
      featuredContentTypeId
      contentType
      contentIds
      contentFilterType
      contentFilterDateAbstract
      alignment
      layout
      textBody
      textColor
      buttonEnabled
      buttonText
      buttonExternalTarget
      buttonInternalTarget
      buttonTargetType
      imageUrl
      originalImageUrl
      imageAltText
    }
  }
`;

export const getPublishedPageOrDefaults = gql`
  query getPublishedPageOrDefaults($input: HubSearch!) {
    getPublishedPageOrDefaults(input: $input) {
      page {
        pageId
        videoCenterId
        status
        sectionIds
      }
      sections {
        sectionId
        originPageId
        pageSectionTemplate
        title
        visibleFields
        contentLimitOnInitialLoad
        featuredContentType
        featuredContentTypeId
        contentType
        contentIds
        contentFilterType
        contentFilterDateAbstract
        alignment
        layout
        textBody
        textColor
        buttonEnabled
        buttonText
        buttonExternalTarget
        buttonInternalTarget
        buttonTargetType
        imageUrl
        originalImageUrl
        imageAltText
      }
    }
  }
`;
