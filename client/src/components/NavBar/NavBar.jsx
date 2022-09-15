import React, { useState } from "react";
import logo from "../../images/logo_transp_bg.png";
import "./navbar.scss";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from "mdb-react-ui-kit";

export default function App() {
  const [showBasic, setShowBasic] = useState(false);

  return (
    <MDBNavbar className="navbar" fixed="top" expand="lg" light bgColor="light">
      <MDBContainer fluid>
        <img src={logo} height="80" alt="" loading="lazy" />
        <div>
          <MDBNavbarToggler
            data-target="#navbarRightAlignExample"
            aria-controls="navbarRightAlignExample"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setShowBasic(!showBasic)}
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>

          <MDBCollapse navbar show={showBasic}>
            <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current="page" href="#">
                  Menu
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current="page" href="#">
                  Užsisakyk
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current="page" href="#">
                  Kontaktai
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </div>
      </MDBContainer>
    </MDBNavbar>
  );
}
