import { render, screen } from '@utils/testUtil';
import React from 'react';
import { waitFor } from '@testing-library/react';
import ShadowDOMComponent from '@components/common/ShadowDOMComponent';

const customHtml = `<div class="topnav" id="myTopnav">
  <a href="#home" class="active">Home</a>
  <a href="#news">News</a>
  <a href="#contact">Contact</a>
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
  <a href="#about">About</a>
 <a href="#side" onclick="openNav()">&#9776; side</span>
  <a href="javascript:void(0);" style="font-size:15px;" class="icon" onclick="myFunction()">&#9776;</a>
<div id="mySidenav" class="sidenav">
  <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
  <a href="#">About</a>
  <a href="#">Services</a>
  <a href="#">Clients</a>
  <a href="#">Contact</a>
</div>
</div>`;

const customCss = `
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

.dropdown-content a {
  float: none; font-family: 'KayPhoDu','Arial','Rubik','Helvetica','Arial';
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

.dropdown:hover .dropdown-content {
  display: block;
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
`;

const customJs = `
function myFunction() {
  var x = document.querySelector('#custom-header').shadowRoot.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}   

function openNav() {
  document.querySelector('#custom-header').shadowRoot.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
 document.querySelector('#custom-header').shadowRoot.getElementById("mySidenav").style.width = "0";
}
`;

describe('Top Navigation', () => {
  it('renders custom component successfully', async () => {
    const { baseElement } = render(
      <ShadowDOMComponent id="custom-header" customHtml={customHtml} customCss={customCss} customJs={customJs} />
    );

    expect(baseElement).toMatchSnapshot();
    expect(await screen.findByTestId('custom-header')).toBeInTheDocument();

    await waitFor(
      async () => {
        // Had do this as shadow component are not accessible directly in regular dom
        // eslint-disable-next-line testing-library/no-node-access
        expect(document.querySelector('#custom-header').shadowRoot.getElementById('mySidenav')).toBeInTheDocument();
      },
      {
        timeout: 1000,
        interval: 100
      }
    );

    // This snapshot should not fail. Please do check the reason before updating it.
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector('#custom-header').shadowRoot.getElementById('myTopnav')).toMatchSnapshot();
  });
});
