import logger from '@wdio/logger';
import VideoCenterPage from '../pages/videoCenter.page';
import VideoCenterCreatePage from '../pages/videoCenterCreate.page';
import VideoCenterDetailPage from '../pages/videoCenterDetail.page';
import BannerPage from '../pages/banner.page';
import BannerDetailPage from '../pages/bannerDetail.page';
import { getConfigs } from '../../configs/testConfig';
import VideoMainPage from '../pages/videoMain.page';
import { waitForClickableAndClick } from './waitHelpers';

const Logger = logger('utils');
const configs = getConfigs();

/**
 * Generate a series of characters including lowercase letters and digits.
 * @param numChars - number of characters to generate
 */
export const generateCharacters = (numChars: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  let result = '';
  for (let i = 0; i < numChars; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

/**
 * Generate a series of characters from lowercase letters and upperCase letters only.
 * @param numChars - number of characters to generate
 */
export const generateString = (numChars: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < numChars; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

/**
 * Generate all information required to create a video center.
 * @returns videocenterData
 */
export const generateVideoCenterData = (): Record<string, string> => {
  const centerInfo = `[PEH] E2e ${generateCharacters(4)}`;
  const ownerInfo = `VC${generateCharacters(9)}`;
  return {
    centerName: centerInfo,
    ownerFirstName: `${ownerInfo}FN`,
    ownerLastName: `${ownerInfo}LN`,
    ownerEmail: `${ownerInfo}@test.com`
  };
};

/**
 * Generate all information required to create a banner in a video center.
 * @returns bannerData
 */
export const generateBannerData = (): Record<string, string> => {
  const bannerInfo = `Banner${generateCharacters(4)}`;
  return {
    bannerName: bannerInfo
  };
};

/**
 * Helper method used for a video center creation flow.
 * @param {Object} videoCenterData - All the data required to create a video center.
 */
export const createVideoCenter = async (videoCenterData: Record<string, string>): Promise<void> => {
  await VideoMainPage.waitForElementLoad(await VideoCenterPage.createVideoCenterButton);
  await VideoCenterPage.createVideoCenterButton.waitForClickable();
  await VideoCenterPage.createVideoCenterButton.click();

  await VideoCenterCreatePage.hasLoaded();
  await VideoCenterCreatePage.videoCenterName.waitForExist();

  await VideoCenterCreatePage.videoCenterName.setValue(videoCenterData.centerName);

  await VideoCenterCreatePage.videoCenterOwnerFirstName.waitForClickable();
  await VideoCenterCreatePage.videoCenterOwnerFirstName.setValue(videoCenterData.ownerFirstName);
  await VideoCenterCreatePage.videoCenterOwnerLastName.waitForClickable();
  await VideoCenterCreatePage.videoCenterOwnerLastName.setValue(videoCenterData.ownerLastName);
  await VideoCenterCreatePage.videoCenterOwnerEmail.waitForClickable();
  await VideoCenterCreatePage.videoCenterOwnerEmail.setValue(videoCenterData.ownerEmail);

  await VideoCenterCreatePage.saveButton.waitForClickable();
  await VideoCenterCreatePage.saveButton.click();
  await VideoCenterDetailPage.hasLoaded();

  Logger.info(`Video Center created: ${videoCenterData.centerName}`);
};

/**
 * Helper method used for a view center deletion flow.
 * @param {string} vcName - Video center name required to delete a video center.
 */
export const deleteVideoCenter = async (vcName: string): Promise<void> => {
  const expandVCButton = await VideoCenterPage.viewMoreActionButton(vcName);
  await expandVCButton.waitForClickable();
  await expandVCButton.click();
  await VideoCenterPage.deleteVideoCenterButton.waitForExist();

  const deleteVCButton = await VideoCenterPage.deleteVideoCenterButton;
  await deleteVCButton.waitForClickable();
  await deleteVCButton.click();
  await VideoCenterPage.confirmDeleteVideoCenterButton.waitForExist();

  await VideoCenterPage.confirmDeleteVideoCenterButton.waitForClickable();
  await VideoCenterPage.confirmDeleteVideoCenterButton.click();
  await VideoCenterPage.hasLoaded();
  await browser.pause(configs.delay.uiBackgroundLoad);

  Logger.info(`Video Center deleted: ${vcName}`);
};

/**
 * Helper method used for a banner creation flow.
 * @param {Object} bannerData - All the data required to create a banner.
 */
export const createBanner = async (bannerData: Record<string, string>, bannerType: string): Promise<void> => {
  await waitForClickableAndClick({ element: BannerPage.createBannerButton });

  await waitForClickableAndClick({ element: BannerPage.createBannerTemplateType(bannerType) });

  await BannerPage.inputBannerName.setValue(bannerData.bannerName);

  await BannerPage.confirmBannerCreationButton.click();

  await BannerDetailPage.hasLoaded();

  Logger.info(`Banner created: ${bannerData.bannerName}`);
};

/**
 * Helper method used for a banner deletion flow.
 * @param {string} bannderName - banner name required to delete a video center.
 */
export const deleteBanner = async (bannerName: string): Promise<void> => {
  await BannerDetailPage.deleteBannerButton.waitForClickable();
  await BannerDetailPage.deleteBannerButton.click();
  await BannerDetailPage.deleteBannerConfirmButton.waitForExist();

  await BannerDetailPage.deleteBannerConfirmButton.waitForClickable();
  await BannerDetailPage.deleteBannerConfirmButton.click();

  await BannerPage.hasLoaded();

  Logger.info(`Banner deleted: ${bannerName}`);
};

export const CUSTOM_HTML = `<div class="topnav" id="myTopnav">
  <a href="#home" class="active">Just a link</a>
  <a href="https://indianexpress.com/" id="id1">Open news in current tab</a>
  <a href="https://indianexpress.com/" target="_blank" id="id2" rel="noopener noreferrer noopener noreferrer noopener noreferrer">Open news in new tab</a>
  <div class="dropdown">
    <button class="dropbtn">Dropdown 
      <i class="fa fa-caret-down"></i>
    </button>
    <div class="dropdown-content">
      <a href="#">Link 1</a>
      <a href="#">Link 2</a>
      <a href="#">Link 3</a>
    </div>
  </div> 
  <a href="#about">Just a link</a>
 <a id="open-side-nav"> Side nav
  </a><a id="top-nav-responsive" class="icon">☰</a>
<div id="mySidenav" class="sidenav">
  <a id="close-side-nav" class="closebtn">×</a>
  <a href="#">About</a>
  <a href="#">Services</a>
  <a href="#">Clients</a>
  <a href="#">Contact</a>
</div>
</div>
`;

export const CUSTOM_CSS = `@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"); 

body {margin:0;font-family:Arial}

.topnav {
  overflow: hidden;
  background-color: #333;
  z-index: 10001;
}

.topnav a {
  float: left;
  display: block;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.active {
  background-color: #04AA6D;
  color: white;
}

.topnav .icon {
  display: none;
}

.dropdown {
  float: left;
  overflow: hidden;
}

.dropdown .dropbtn {
  font-size: 17px;    
  border: none;
  outline: none;
  color: white;
  padding: 14px 16px;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 10001;
}

#id1 {
font-family: 'Two Words','Rubik','Helvetica','Arial';
}

#id2 {
font-family: 'Tangerine','Rubik','Helvetica','Arial';
}

.dropdown-content a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.topnav a:hover, .dropdown:hover .dropbtn {
  background-color: #555;
  color: white;
}

.dropdown-content a:hover {
  background-color: #ddd;
  color: black;
}



@media screen and (max-width: 600px) {
  .topnav a:not(:first-child), .dropdown .dropbtn {
    display: none;
  }
  .topnav a.icon {
    float: right;
    display: block;
  }
}

@media screen and (max-width: 600px) {
  .topnav.responsive {position: relative;}
  .topnav.responsive .icon {
    position: absolute;
    right: 0;
    top: 0;
  }
  .topnav.responsive a {
    float: none;
    display: block;
    text-align: left;
  }
  .topnav.responsive .dropdown {float: none;}
  .topnav.responsive .dropdown-content {position: relative;}
  .topnav.responsive .dropdown .dropbtn {
    display: block;
    width: 100%;
    text-align: left;
  }
}  

.sidenav {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #111;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
}

.sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.sidenav a:hover {
  color: #f1f1f1;
}

.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}

.dropdown:hover .dropdown-content {
  display: block;
}`;

export const CUSTOM_JS = `var link=document.createElement("link");
link.type="text/css";
link.rel="stylesheet";
link.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";

document.head.appendChild(link);

const styleElement = document.createElement('style');
styleElement.textContent = \`
  @font-face {
  font-family: Tangerine;
  src: url(https://fonts.gstatic.com/s/tangerine/v17/IurY6Y5j_oScZZow4VOxCZZMprNA4A.woff2) format('woff2');
}
\`;
document.head.appendChild(styleElement);


 document.querySelector('#custom-header').shadowRoot.getElementById("top-nav-responsive").addEventListener('click', function () {
         var x = document.querySelector('#custom-header').shadowRoot.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
          } else {
             x.className = "topnav";
      }
});



document.querySelector('#custom-header').shadowRoot.getElementById("open-side-nav").addEventListener('click', function () {
       document.querySelector('#custom-header').shadowRoot.getElementById("mySidenav").style.width = "240px";
});

 document.querySelector('#custom-header').shadowRoot.getElementById("close-side-nav").addEventListener('click', function () {
       document.querySelector('#custom-header').shadowRoot.getElementById("mySidenav").style.width = "0px";
});`;
