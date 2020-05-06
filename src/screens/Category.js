import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import CardRow from '../components/CardRow';


function Category(props) {
    const { id } = useParams();
    
    function convert(){
        switch(id){
            case "0":
                return "Notebooks"
                break;
            case "1":
                return "PC Gamers"
                break;
            case "2":
                return "Tablets"
                break;
            default:
                return "Categoria não encontrada"
        }
    }
    return(
        <Container>
            <h1>Os produtos da nossa linha de {convert()}</h1>
            <CardRow produtos = {props.produtos} home={false} id={parseInt(id)}/>
        </Container>
    )
}

export default Category;


