import appfeatures from './appfeatures';
import banner from './banner';
import catalog from './catalog';
import channel from './channel';
import contacts from './contacts';
import coreSOA from './coreSOA';
import hub from './hub';
import login from './login';
import memberList from './memberList';
import navigation from './navigation';
import profile from './profile';
import registrationSettings from './registrationSettings';
import snapshot from './snapshot';
import trackingcodes from './trackingcodes';
import upcomingevents from './upcomingevents';
import upload from './upload';
import video from './video';
import analytics from './analytics';
import customDomain from './customDomain';
import shortUrl from './shortUrl';
import fileImport from './fileImport';
import entityMedia from './entityMedia';

const resolvers = [
  analytics,
  appfeatures,
  banner,
  catalog,
  channel,
  contacts,
  coreSOA,
  hub,
  login,
  memberList,
  navigation,
  profile,
  registrationSettings,
  snapshot,
  trackingcodes,
  upcomingevents,
  upload,
  video,
  customDomain,
  shortUrl,
  fileImport,
  entityMedia
];

export default resolvers;
