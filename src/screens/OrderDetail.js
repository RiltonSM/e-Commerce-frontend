import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Col, Row, Table } from 'react-bootstrap';

import Loading from './Loading';
import api from '../apis/apiLocal';

const OrderDetail = props => {
    let params = useParams();
    console.log(params)
    params = params.id;

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState([])
    const [orderData, setOrderData] = useState({});
    const [status, setStatus] = useState(0);
    useEffect(() => {
        async function getDetails(){
            const order = await api.get(`getCode/${params}`);
            setOrderData(order.data[0]);
            const info = await api.get(`getStatus/${order.data[0]["code"]}`);
            setStatus(parseInt(info.data));
            setQuantity(JSON.parse(order.data[0].quantity));
            const idProduct = JSON.parse(order.data[0].products);

            idProduct.map(async item => {
                await api.get(`item/${item}`)
                .then(response => {
                    console.log(response.data);
                    setProducts(...products, response.data)
                })
            })
            setLoading(false);
            console.log(info.data, order.data[0]);
        }

        getDetails();
    }, [])

    return(
        loading ? <Loading /> :
        <Container>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>
                                    Cód. Pedido
                                </th>
                                <th>
                                    Produto
                                </th>
                                <th>
                                    Quantidade
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map((product, i) => (
                                    <tr key={i}>
                                        <td>#{params.padStart(8, '0')}</td>
                                        <td>{product.nome}</td>
                                        <td>{quantity[i]}</td>
                                        
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Status do pagamento: {status === 1 ? "Processando pagamento" : "Pago"}</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Total: R$ {parseFloat(orderData.total).toFixed(2)}</h2>
                </Col>
            </Row>
        </Container>
    )
}

export default OrderDetail;