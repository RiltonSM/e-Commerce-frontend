import React from  'react';
import {Container, Col, Row, Spinner} from 'react-bootstrap';

const Loading = () => {
    return(
        <Container className="w-100" style={{height: '75%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Spinner animation="border" variant="primary"/>
        </Container>
    )
}

export default Loading;