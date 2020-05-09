import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import CardRow from '../components/CardRow';
import Loading from '../screens/Loading';

import api from '../apis/apiLocal';

function Category() {
    const { id } = useParams();
    const [ produtos, setProdutos ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const searchProdutcs = async () =>{
            const response = await api.get(`category/${id}`);
            setProdutos(response.data);
            setLoading(false)
        }

        searchProdutcs();
    }, [])
    
    function convert(){
        switch(id){
            case "0":
                return "Notebooks"
            case "1":
                return "PC Gamers"
            case "2":
                return "Tablets"
            default:
                return "Categoria não encontrada"
        }
    }
    return(
        loading ? <Loading/> :
        <Container>
            <h1>Os produtos da nossa linha de {convert()}</h1>
            <CardRow produtos = {produtos} home={false} id={parseInt(id)}/>
        </Container>
    )
}

export default Category;


