import React from 'react';
import { Container, Col, Row, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const ItemBuyed = props => {
    const img = props.img;
    const description = props.description;
    const listItem = JSON.parse(props.description[1]);
    return (
        <Container>
            <Row>
                <h2>{`Pedido #${props.id.padStart(8, '0')}`}</h2>
            </Row>
            <Row>
                <Col xs={4}>
                    <Image width={150} src={require(`../images/${img}.jpg`)} fluid></Image>
                </Col>
                <Col xs={8}>
                    <Row>
                        <h3>{listItem.length > 1 ? `${description[0]} + ${listItem.length - 1} itens` : description[0]}</h3>
                    </Row>
                    <Row>
                        <Link to={`/requests/detail/${props.id}`}><Button>Detalhes</Button></Link>
                    </Row>
                </Col>
                <hr/>
            </Row>
        </Container>
        
    )
}

export default ItemBuyed;

