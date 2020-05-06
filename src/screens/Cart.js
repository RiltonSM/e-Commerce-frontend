import React from 'react';
import { Container, Row, Col, Jumbotron } from 'react-bootstrap';
import { BrowserRouter as Router, Link } from 'react-router-dom';

import ItemCart from '../components/ItemCart';

const Cart = props => {
    return(
        <div>
            <Container style ={{marginTop: 15}}>
            {   
                props.cart.map((produto, i) => {
                    return (
                        <div key={i}>
                            <ItemCart 
                                indice={i} 
                                produto={produto} 
                                addQuant={props.addQuant} 
                                subQuant={props.subQuant}
                                removeCart={props.removeCart}
                            />
                            <hr />
                        </div>
                        
                    )
                })
            }
            {
                props.total === 0 ? 
                
                <Jumbotron fluid style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div>
                        <Col style={{display: 'flex', justifyContent: 'center'}}>
                            <h2>Ops!</h2>
                        </Col>
                    
                        <Col>
                            <h4>Carrinho Vazio</h4>
                        </Col>
                    </div>
                </Jumbotron> 
                    
                :
                <div>
                <Row style={{display: 'flex', alignItems: 'center'}}>
                    <Col xs={10} style={{justifyContent: 'center'}}>
                        <h2>Total</h2>
                    </Col>
                    <Col xs={2} style={{justifyContent: 'center'}}>
                        <h2>R$ {props.total}</h2>
                    </Col>
                </Row>
                <Row>
                    <Link className='btn btn-primary ml-auto' to='/pay'>Pagar</Link>
                </Row>
                </div>
            }
            
            </Container>
        </div>
    )
}

export default Cart;