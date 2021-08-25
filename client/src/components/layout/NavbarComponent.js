import React, { Fragment } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const NavbarComponent = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <Fragment>
      <Nav.Link>
        <Link to='/register' className='nav-link-overwrite'>
          Dashboard
        </Link>
      </Nav.Link>
      <Nav.Link>
        <Link to='/' className='nav-link-overwrite' onClick={logout}>
          Logout
        </Link>
      </Nav.Link>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <Nav.Link>
        <Link to='/register' className='nav-link-overwrite'>
          Register
        </Link>
      </Nav.Link>
      <Nav.Link>
        <Link to='/login' className='nav-link-overwrite'>
          Login
        </Link>
      </Nav.Link>
    </Fragment>
  );

  return (
    <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Container>
        <Navbar.Brand href='/'>Talking Tester</Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='ms-auto'>
            {!loading && (
              <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
            )}
            <NavDropdown title='About App' id='collasible-nav-dropdown'>
              <NavDropdown.Item>
                <Link to='/about-creator'>About Creator</Link>
              </NavDropdown.Item>
              <NavDropdown.Item href='#action/3.2'>
                App Details
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href='#action/3.4'>
                Contact Creator
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(NavbarComponent);
