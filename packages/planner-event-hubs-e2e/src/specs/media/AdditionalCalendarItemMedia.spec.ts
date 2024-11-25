/* eslint-disable jest/no-test-prefixes */
import path from 'path';
import AdditionalCalendarItemMedia from '../../pages/AdditionalCalendarItemMedia.page';
import { loginAsPlanner } from '../../utils/authUtils';
import { skipDescribeIfProdEnvironment } from '../../utils/commonUtils';

// May need to change the additional calendar id to one that is compatible with CORE test account
// For now this is an arbitrary id
const additionalCalendarId = 'ff619769-d075-405a-8d2c-a20fe82cad0c';

const moreThan5Mb = path.join(__dirname, '..', '..', 'resources', 'images', 'moreThan5Mb.jpg');

skipDescribeIfProdEnvironment()('Additional Calendar Item Media Upload Page', () => {
  it('Should display upload image button and informational text', async () => {
    await loginAsPlanner();
    await AdditionalCalendarItemMedia.openPage(additionalCalendarId);
    // Validating image upload page
    expect(await AdditionalCalendarItemMedia.viewCard()).toBeDisplayed();
    expect(await AdditionalCalendarItemMedia.viewCard()).toHaveTextContaining('Event Image');
    expect(await AdditionalCalendarItemMedia.viewCard()).toHaveTextContaining(
      'Add an image for your additional calendar event. This image will be displayed on your event calendar.'
    );
    expect(await AdditionalCalendarItemMedia.viewCard()).toHaveTextContaining('Image:');
    expect(await AdditionalCalendarItemMedia.imageIcon()).toExist();
    expect(await AdditionalCalendarItemMedia.imageUploadButton()).toBeDisplayed();
    expect(await AdditionalCalendarItemMedia.viewCard()).toHaveTextContaining(
      'Supported file types: JPEG, JPG, PNG. File size up to 5 MB.'
    );
    expect(await AdditionalCalendarItemMedia.viewCard()).toHaveTextContaining(
      'Recommended size: 1280 x 720 pixels. Aspect ratio must be 16:9.'
    );
  });

  it('Should display unsupported file alert if image of more than 5mb is uploaded', async () => {
    // Attaching image of more than 5 mb and validated the alert box
    await (await AdditionalCalendarItemMedia.imageUploadButton()).click();
    await (await AdditionalCalendarItemMedia.imageUploadInput()).setValue(moreThan5Mb);
    expect(await AdditionalCalendarItemMedia.unsupportedFileAlertBox()).toExist();
    expect(await AdditionalCalendarItemMedia.unsupportedFileAlertBox()).toHaveTextContaining('moreThan5Mb');
  });
});
