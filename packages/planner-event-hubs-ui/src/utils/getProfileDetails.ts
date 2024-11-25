import { ProfileSettings } from '@components/privacy/type/PrivacySettings';
import { ProfileData } from '@cvent/multi-dimensional-profile/types/Profile';
import profileImage from '../../public/profile.png';

export const getProfileDetails = (settings: ProfileSettings): ProfileData => {
  let profileData: ProfileData = {
    id: 'profileId',
    firstName: 'Renae Carter',
    lastName: 'Monroe',
    prefix: 'Mrs.',
    designation: 'PhD',
    profileImageUrl: profileImage.src
  };
  if (settings?.profileCard?.showJobTitle) {
    profileData = { ...profileData, title: 'Senior Director of Technology' };
  }
  if (settings?.profileCard?.showCompany) {
    profileData = { ...profileData, company: 'Aventech' };
  }
  return profileData;
};
