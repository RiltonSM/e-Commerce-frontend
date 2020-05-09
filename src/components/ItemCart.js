import React from 'react';
import {Container, Image, Col, Row} from 'react-bootstrap';

const ItemCart = props => {
    console.log(props);
    const img = props.produto.imagem;
    return(
        <Container>
            <Row>
                <Col xs={12} md={4} lg={2} xl={3}>
                    <Image src = {require(`../images/${img}.jpg`)} fluid/>
                </Col>
                <Col xs={12} md={3} lg={4} xl={3}>
                    <h1>{props.produto.nome}</h1>
                    <h4 style={{display: window.screen.width < 400 ? 'none' : 'flex'}}>R$ {props.produto.valor}</h4>
                </Col>
                <Col xs={3} md={3} lg={2} style={{display: 'flex', justifyContent: 'center'}}>
                    <Row style={{alignItems: 'center'}}>
                        <i onClick={() => props.subQuant(props.indice)} className="fas fa-minus" style={{marginRight: 10}}></i>
                        <span style={{marginRight: 10}}>{props.produto.quantidade}</span>
                        <i onClick={() => props.addQuant(props.indice)} className="fas fa-plus" style={{marginRight: 10}}></i>
                    </Row>
                </Col>
                <Col xs={2} md={1} lg={2} style={{display: 'flex', justifyContent: 'center'}}>
                    <Row style={{alignItems: 'center'}}>
                        <i onClick={() => props.removeCart(props.indice)} className="far fa-trash-alt"></i>
                    </Row>
                </Col>
                <Col xs={7} md={2} lg={2} style={{display: 'flex', justifyContent: 'center'}}>
                    <Row style={{alignItems: 'center'}}>
                        <h3>R$ {props.produto.valor * props.produto.quantidade}</h3>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default ItemCart;