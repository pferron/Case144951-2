import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import { RegistrationCountResponse } from '@cvent/planner-event-hubs-model/src/operations';
import { DAY_IN_MILLISECONDS, mapToDays, mapToMonths, mapToWeeks } from '@resolvers/common/utils/registrationUtils';

export const getTotalRegistrationCount = async (
  videoCenterClient: VideoCenterClient,
  hubId: string,
  startDateStr: string,
  endDateStr: string
): Promise<RegistrationCountResponse> => {
  try {
    const startDate = Date.parse(startDateStr);
    const endDate = Date.parse(endDateStr);
    const diffInDays = (endDate - startDate) / DAY_IN_MILLISECONDS;
    if (diffInDays > 365) {
      throw new Error('Time difference can not be greater then 365 days');
    }
    let response = {};
    if (diffInDays > 0) {
      const totalRegistrationCountData = await videoCenterClient.registrationCount(hubId, startDateStr, endDateStr);
      if (diffInDays <= 13) {
        response = mapToDays(totalRegistrationCountData, startDate, endDate);
      } else if (diffInDays <= 60) {
        response = mapToWeeks(totalRegistrationCountData, startDate, endDate);
      } else {
        response = mapToMonths(totalRegistrationCountData, startDate, endDate);
      }
    }
    return response;
  } catch (error) {
    return {
      serverError: true
    };
  }
};
