import React from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

const Header = props => {
    const history = useHistory();

    const user = () => {
        const data = JSON.parse(sessionStorage.getItem('user'));
        console.log(data[0]);
        return data[0].name;
    }
    
    console.log(props);
    return(
        <Navbar bg="primary" variant="dark" expand="lg"  style={{marginBottom: 10}}>
            <Link to="/"><Navbar.Brand>{props.info.brand}</Navbar.Brand></Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    
                    <Link to="/" style={{textDecoration: 'none'}}><Nav.Link as="li">{props.info.link[1]}</Nav.Link></Link>
                    
                    <NavDropdown title={props.info.dropdown.titulo} id="basic-nav-dropdown">
                        <Link to="/category/0"><NavDropdown.Item as="span">{props.info.dropdown[1]}</NavDropdown.Item></Link>
                        <Link to="/category/1"><NavDropdown.Item as="span">{props.info.dropdown[2]}</NavDropdown.Item></Link>
                        <Link to="/category/2"><NavDropdown.Item as="span">{props.info.dropdown[3]}</NavDropdown.Item></Link>
                    </NavDropdown>
                </Nav>
                <Nav className="ml-auto">
                    {
                        props.session ?
                            <NavDropdown title={user()} id="basic-nav-dropdown-user">
                                <Link to="/requests" style={{textDecoration: 'none'}}><NavDropdown.Item as="span">Meus pedidos</NavDropdown.Item></Link>
                                <Link to="/requests" style={{textDecoration: 'none'}}><NavDropdown.Item as="span">Favoritos</NavDropdown.Item></Link>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as="span" onClick={() => props.logout(history)}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        :
                            <Link to="/login">
                                <Button>Login</Button>
                            </Link>
                    }
                    
                    <Link to="/cart" style={{textDecoration: 'none'}}>
                        <Nav.Link as="span" style={{textDecoration: 'none'}}>
                            <div style={{display: 'flex'}}>
                                <i style={{color: 'white'}} className="fas fa-shopping-cart"></i>
                                <div style={styles.cart}>{props.number}</div>
                            </div>
                        </Nav.Link>
                    </Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}


const styles = { 
    cart: {
        width: 18, 
        height: 18, 
        position: 'relative', 
        bottom: 10, 
        right: 8, 
        borderWidth: 2, 
        borderStyle: 'solid', 
        borderRadius: 9, 
        borderColor: 'red', 
        backgroundColor: 'red', 
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        color: 'white',
        opacity: 1.0
   },
    number: {
        opacity: 1.0
    }
}

export default Header;