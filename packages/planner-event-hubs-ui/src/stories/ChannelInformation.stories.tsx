import { ChannelInformationFormData } from '@components/channels/information/ChannelInformationFormData';
import { ChannelInformationType } from '@components/channels/type/channel';
import { CardBody, CardContainer } from '@cvent/carina/components/Card';
import { Form } from '@cvent/carina/components/Forms';
import { ChannelStatus } from '@cvent/planner-event-hubs-model/types';
import { useState } from 'react';
import { StoryWrapper } from './utils/StoryWrapper';

const dummyChannel = {
  title: 'Test Channel',
  description: 'This is a test channel',
  status: ChannelStatus.Inactive,
  id: 'b2deeb51-371e-4fa4-83e3-6d7f6823c33f',
  catalogId: null,
  image: {
    filename: 'Screenshot 2021-09-29 at 8.47.12 PM.png',
    url: 'https://custom.t2.cvent.com/cd78dd5d65224e918db8104df6b84ec2/b2deeb51-371e-4fa4-83e3-6d7f6823c33f/image/95eccb97-346e-4bf3-a74b-92d87c7ae0b0.png',
    size: '948808 KB',
    imageId: 'f9a29984-9e2d-47b4-b223-953e6ca47a08',
    createdAt: '2022-05-05T17:48:16.200Z'
  }
};

const newImage = {
  filename: 'test.png',
  imageId: 'random id',
  url: 'https://dummyimage.com/600x400/000/fff',
  size: `${12321323 / 1000}KB`,
  croppedUrl: 'https://dummyimage.com/600x400/000/fff',
  createdAt: '2022-05-05T17:48:16.200Z'
};

export default {
  title: 'Channel Information'
};

export function ChannelInformation(): JSX.Element {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [channel, setChannel] = useState<ChannelInformationType>(dummyChannel);

  const onSubmit = (event, submission): void => {
    setEditMode(false);
    setChannel(submission.values);
  };

  return (
    <StoryWrapper>
      <div style={{ padding: '1.5rem 1.5rem 1.5rem 1.5rem', width: '100%' }}>
        <CardContainer height="100%" width="100%" responsive>
          <div style={{ padding: '1.25rem 1.25rem 1.25rem 1.25rem', height: '100%', width: '100%' }}>
            <CardBody>
              <Form
                readOnly={!editMode}
                initialValues={channel}
                initializationMode="reinitialize"
                onSubmit={onSubmit}
                key={editMode.toString()}
              >
                <ChannelInformationFormData
                  channelData={dummyChannel}
                  imageDeleted={false}
                  setImageDeleted={() => {
                    // Comment to remove ts warnings
                  }}
                  newImage={newImage}
                  setNewImage={() => {
                    // Comment to remove ts warnings
                  }}
                  setIsPageEdited={() => {
                    // Comment to remove ts warnings
                  }}
                  setChannelStatus={() => {
                    // Comment to remove ts warnings
                  }}
                  channelStatus={ChannelStatus.Inactive}
                />
              </Form>
            </CardBody>
          </div>
        </CardContainer>
      </div>
    </StoryWrapper>
  );
}
