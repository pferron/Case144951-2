import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import { getTotalRegistrationCount } from '@resolvers/common/dataAccess/registrations';
import { totalRegistrationData } from '@dataSources/__TestUtils__/fixtures/registrationCountData';

describe('dataAccess/registrations', () => {
  let mockVideoCenterClient: VideoCenterClient;

  const hubId = 'baa1deee-289a-452b-9c95-190ba185775f';
  const startDate = '2023-08-01T00:00:00Z';
  const endDate13Days = '2023-08-14T00:00:00Z';
  const endDate60Days = '2023-09-30T00:00:00Z';
  const endDate100Days = '2023-11-09T00:00:00Z';

  beforeEach(() => {
    mockVideoCenterClient = new VideoCenterClient();
    mockVideoCenterClient.registrationCount = jest.fn().mockReturnValue(totalRegistrationData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should give data in perDay when start and end difference is upto 13 days', async () => {
    const response = await getTotalRegistrationCount(mockVideoCenterClient, hubId, startDate, endDate13Days);
    expect(response.perDay).toBeTruthy();
    expect(response.perWeek).toBeFalsy();
    expect(response.perMonth).toBeFalsy();

    expect(response.perDay.length).toBe(14);
    expect(response.perDay[0].date.toLocaleDateString()).toBe('8/1/2023');
    expect(response.perDay[1].date.toLocaleDateString()).toBe('8/2/2023');
    expect(response.perDay[2].date.toLocaleDateString()).toBe('8/3/2023');
    expect(response.perDay[3].date.toLocaleDateString()).toBe('8/4/2023');
    expect(response.perDay[4].date.toLocaleDateString()).toBe('8/5/2023');
    expect(response.perDay[5].date.toLocaleDateString()).toBe('8/6/2023');
    expect(response.perDay[6].date.toLocaleDateString()).toBe('8/7/2023');
    expect(response.perDay[7].date.toLocaleDateString()).toBe('8/8/2023');
    expect(response.perDay[8].date.toLocaleDateString()).toBe('8/9/2023');
    expect(response.perDay[9].date.toLocaleDateString()).toBe('8/10/2023');
    expect(response.perDay[10].date.toLocaleDateString()).toBe('8/11/2023');
    expect(response.perDay[11].date.toLocaleDateString()).toBe('8/12/2023');
    expect(response.perDay[12].date.toLocaleDateString()).toBe('8/13/2023');
    expect(response.perDay[13].date.toLocaleDateString()).toBe('8/14/2023');

    expect(response.total).toBe(25);
  });

  it('should give data in perMonth when start and end difference is upto 60 days', async () => {
    const response = await getTotalRegistrationCount(mockVideoCenterClient, hubId, startDate, endDate60Days);
    expect(response.perWeek).toBeTruthy();
    expect(response.perDay).toBeFalsy();
    expect(response.perMonth).toBeFalsy();

    expect(response.perWeek.length).toBe(9);
    expect(response.perWeek[0].date.toLocaleDateString()).toBe('7/30/2023');
    expect(response.perWeek[1].date.toLocaleDateString()).toBe('8/6/2023');
    expect(response.perWeek[2].date.toLocaleDateString()).toBe('8/13/2023');
    expect(response.perWeek[3].date.toLocaleDateString()).toBe('8/20/2023');
    expect(response.perWeek[4].date.toLocaleDateString()).toBe('8/27/2023');
    expect(response.perWeek[5].date.toLocaleDateString()).toBe('9/3/2023');
    expect(response.perWeek[6].date.toLocaleDateString()).toBe('9/10/2023');
    expect(response.perWeek[7].date.toLocaleDateString()).toBe('9/17/2023');
    expect(response.perWeek[8].date.toLocaleDateString()).toBe('9/24/2023');

    expect(response.total).toBe(25);
  });

  it('should give data in perMonth when start and end difference is more than 60 days', async () => {
    const response = await getTotalRegistrationCount(mockVideoCenterClient, hubId, startDate, endDate100Days);
    expect(response.perMonth).toBeTruthy();
    expect(response.perDay).toBeFalsy();
    expect(response.perWeek).toBeFalsy();

    expect(response.perMonth.length).toBe(4); // Including start date
    expect(response.perMonth[0].date.toLocaleDateString()).toBe('8/1/2023');
    expect(response.perMonth[1].date.toLocaleDateString()).toBe('9/1/2023');
    expect(response.perMonth[2].date.toLocaleDateString()).toBe('10/1/2023');
    expect(response.perMonth[3].date.toLocaleDateString()).toBe('11/1/2023');

    expect(response.total).toBe(25);
  });

  it('getTotalRegistrationCount throws error when day difference > 365', async () => {
    const response = await getTotalRegistrationCount(
      mockVideoCenterClient,
      hubId,
      '2023-08-01T00:00:00Z',
      '2025-08-01T00:00:00Z'
    );
    expect(response).toStrictEqual({
      serverError: true
    });
  });
});
