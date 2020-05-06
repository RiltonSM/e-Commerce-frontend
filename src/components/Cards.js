import React from 'react';
import { Card,  Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Cards = props => {
    console.log(props)
    const img = props.produto.imagem;
    return(
        <Card border="secondary">
            <Card.Img variant="top" src={require(`../images/${img}.jpg`)} style={styles.img}/>  
            <Card.Body>
                <Card.Text>{props.produto.nome}</Card.Text>
                <Card.Title>R$ {props.produto.valor}</Card.Title>
                <Link to={`/detail/${props.produto.id}`}><Button>Detalhes</Button></Link>
            </Card.Body>
        </Card>
    );
}

const styles = {
    img: {
       width: 200,
       height: 100
    }
}
export default Cards;