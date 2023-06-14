import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const NavbarHeader = () => {
  return (
    <header className="py-2" id="navheader">
      <Navbar expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand id="navBrand">LET'S FIT SWOLE</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link className="text-light" href="#Home">
                Home
              </Nav.Link>
              <Nav.Link className="text-light" href="#About">
                About
              </Nav.Link>
              <Nav.Link
                className="text-light"
                href="https://natekarnsportfolio.netlify.app/"
              >
                Contact
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default NavbarHeader;
