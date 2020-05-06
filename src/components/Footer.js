import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';

class Footer extends React.Component {
    render(){
        return(
            <Navbar bg='primary' variant="dark" fixed="bottom">
                <Navbar.Brand>Rodapé</Navbar.Brand>
                
                <Nav className="ml-auto">
                    <Nav.Link><i className="fab fa-facebook"></i></Nav.Link>
                    <Nav.Link><i className="fab fa-twitter"></i></Nav.Link>
                    <Nav.Link><i className="fab fa-linkedin-in"></i></Nav.Link>
                </Nav>
            </Navbar>
            
        );
    }
}

export default Footer;