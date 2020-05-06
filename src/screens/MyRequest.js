import React, { useState, useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import api from '../apis/apiLocal';

import ItemBuyed from '../components/ItemBuyed';

const MyRequest = props => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([])
    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        
        api.post(`getCart`, {
            "userId": user[0].id
        }).then(response => {
            console.log(response.data);
            setOrders(response.data);
        });
    }, [])

    useEffect(() => {
        async function getElements(){
            if(orders !== []){
                orders.map(async (item) => {
                    await api.get(`item/${JSON.parse(item.products)}`)
                    .then(response => {
                        setProducts(products => [...products, response.data]);
                    });
                });
                
            }
        }

        getElements();
        
    }, [orders]);

    return(
        <Container>
            {
                products.length !== orders.length ? <h2>Aguarde</h2> : 
                orders.map((item, i) => {
                    console.log(item, products[i], products[i][0].imagem, products[i][0].nome);
                    return <ItemBuyed key={item.id} img={`${products[i][0].imagem}`} description={[`${products[i][0].nome}`, item.products]} id={`${item.id}`}/>
                })
            }
        </Container>
    );
}

export default MyRequest;