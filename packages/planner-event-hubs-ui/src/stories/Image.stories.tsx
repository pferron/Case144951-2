import React from 'react';
import { Image } from '@components/common/imageUpload/Image';
import { CardBody, CardContainer } from '@cvent/carina/components/Card';
import { Form } from '@cvent/carina/components/Forms';
import { aspectRatioTypes } from '@cvent/image-editor';
import { StoryWrapper } from './utils/StoryWrapper';

export default {
  title: 'Channel Image'
};

const newImageData = {
  filename: 'test-image.png',
  url: 'https://dummyimage.com/600x400/000/fff',
  croppedUrl: 'https://dummyimage.com/600x400/000/fff',
  imageId: '0000000001',
  size: '1000',
  createdAt: '2022-05-05T17:48:16.200Z'
};

const currentImageData = {
  filename: 'test-image.png',
  url: 'https://dummyimage.com/600x400/000/fff',
  imageId: '0000000001',
  size: '1000',
  createdAt: '2022-05-05T17:48:16.200Z'
};

export function ChannelImageInEditMode(): React.JSX.Element {
  return (
    <StoryWrapper>
      <div style={{ padding: '1.5rem 1.5rem 1.5rem 1.5rem', width: '100%' }}>
        <CardContainer height="100%" width="100%" responsive>
          <div style={{ padding: '1.25rem 1.25rem 1.25rem 1.25rem', height: '100%', width: '100%' }}>
            <CardBody>
              <Form>
                <Image
                  editMode
                  setNewImage={() => {
                    // Comment to remove ts warnings
                  }}
                  newImage={newImageData}
                  currentImage={currentImageData}
                  imageDeleted={false}
                  setImageDeleted={() => {
                    // Comment to remove ts warnings
                  }}
                  supportedText=""
                  recommendedText=""
                  incorrectImageUploadText=""
                  maxWidthImage={20}
                  noImageTitleText="channel_empty_image_alt_text"
                  imageAltText="channel_image_alt_text"
                  noImageUploadedText="channel_empty_image_alt_text"
                  showPlaceHolderInReadMode
                  imageMaximumSize={1000}
                  entityId=""
                  aspectRatio={aspectRatioTypes.sixteenByNine}
                  allowImageEdit
                />
              </Form>
            </CardBody>
          </div>
        </CardContainer>
      </div>
    </StoryWrapper>
  );
}

export function NoChannelImageInViewMode(): React.JSX.Element {
  return (
    <StoryWrapper>
      <div style={{ padding: '1.5rem 1.5rem 1.5rem 1.5rem', width: '100%' }}>
        <CardContainer height="100%" width="100%" responsive>
          <div style={{ padding: '1.25rem 1.25rem 1.25rem 1.25rem', height: '100%', width: '100%' }}>
            <CardBody>
              <Form>
                <Image
                  editMode={false}
                  setNewImage={() => {
                    // Comment to remove ts warnings
                  }}
                  newImage={null}
                  currentImage={null}
                  imageDeleted={false}
                  setImageDeleted={() => {
                    // Comment to remove ts warnings
                  }}
                  supportedText=""
                  recommendedText=""
                  incorrectImageUploadText=""
                  maxWidthImage={20}
                  noImageTitleText="channel_empty_image_alt_text"
                  imageAltText="channel_image_alt_text"
                  noImageUploadedText="channel_empty_image_alt_text"
                  showPlaceHolderInReadMode
                  imageMaximumSize={1000}
                  entityId=""
                  aspectRatio={aspectRatioTypes.sixteenByNine}
                  allowImageEdit
                />
              </Form>
            </CardBody>
          </div>
        </CardContainer>
      </div>
    </StoryWrapper>
  );
}

export function NoChannelImageInEditMode(): React.JSX.Element {
  return (
    <StoryWrapper>
      <div style={{ padding: '1.5rem 1.5rem 1.5rem 1.5rem', width: '100%' }}>
        <CardContainer height="100%" width="100%" responsive>
          <div style={{ padding: '1.25rem 1.25rem 1.25rem 1.25rem', height: '100%', width: '100%' }}>
            <CardBody>
              <Form>
                <Image
                  editMode
                  setNewImage={() => {
                    // Comment to remove ts warnings
                  }}
                  newImage={null}
                  currentImage={null}
                  imageDeleted={false}
                  setImageDeleted={() => {
                    // Comment to remove ts warnings
                  }}
                  supportedText=""
                  recommendedText=""
                  incorrectImageUploadText=""
                  maxWidthImage={20}
                  noImageTitleText="channel_empty_image_alt_text"
                  imageAltText="channel_image_alt_text"
                  noImageUploadedText="channel_empty_image_alt_text"
                  showPlaceHolderInReadMode
                  imageMaximumSize={1000}
                  entityId=""
                  aspectRatio={aspectRatioTypes.sixteenByNine}
                  allowImageEdit
                />
              </Form>
            </CardBody>
          </div>
        </CardContainer>
      </div>
    </StoryWrapper>
  );
}

export function ChannelImageInViewMode(): React.JSX.Element {
  return (
    <StoryWrapper>
      <div style={{ padding: '1.5rem 1.5rem 1.5rem 1.5rem', width: '100%' }}>
        <CardContainer height="100%" width="100%" responsive>
          <div style={{ padding: '1.25rem 1.25rem 1.25rem 1.25rem', height: '100%', width: '100%' }}>
            <CardBody>
              <Form>
                <Image
                  editMode={false}
                  setNewImage={() => {
                    // Comment to remove ts warnings
                  }}
                  newImage={newImageData}
                  currentImage={currentImageData}
                  imageDeleted={false}
                  setImageDeleted={() => {
                    // Comment to remove ts warnings
                  }}
                  supportedText=""
                  recommendedText=""
                  incorrectImageUploadText=""
                  maxWidthImage={20}
                  noImageTitleText="channel_empty_image_alt_text"
                  imageAltText="channel_image_alt_text"
                  noImageUploadedText="channel_empty_image_alt_text"
                  showPlaceHolderInReadMode
                  imageMaximumSize={1000}
                  entityId=""
                  aspectRatio={aspectRatioTypes.sixteenByNine}
                  allowImageEdit
                />
              </Form>
            </CardBody>
          </div>
        </CardContainer>
      </div>
    </StoryWrapper>
  );
}
