import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Jumbotron, Button } from 'react-bootstrap';

import Loading from './Loading';
import api from '../apis/apiLocal';

import CardRow from '../components/CardRow';

const Detail = props => {
    const [ produto, setProduto ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    let params = useParams();
    params = params.null;
    
    useEffect(() => {
        async function getProduct(){
            let item = await api.get(`item/${params}`);
            item.data[0] = {
                ...item.data[0],
                quantidade: 1
            };
            console.log(item.data[0]);
            setProduto(item.data);
            setLoading(false);
        }

        getProduct();
    }, [])
    //console.log(params, produto);
    //produto[0].quantidade = 1;
    //const img = produto[0].imagem;
    
    return(
        <div>
            {loading ? <Loading/> :
            <Container>
                <Row className='justify-content-center'>
                    <Col xs={12} md={6}>
                        <Image src={require(`../images/${produto[0].imagem}.jpg`)} style={{width: 450, height: 230}}/>
                    </Col>
                    <Col xs={12} md={6}>
                        <Jumbotron className="border border-primary" fluid style={{backgroundColor: '#FFF', borderRadius: 10, paddingTop: 0}}>
                            <div style={{marginLeft: 10}}>
                                <h1 style={{marginTop: 0}}>{produto[0].nome}</h1>
                                {produto[0].promocao ? 
                                <div><h6 className="text-secondary"><del>{`De: R$ ${produto[0].valorAnt}`}</del></h6>
                                <h4>{`Por: R$ ${produto[0].valor}`}</h4></div> : <h4>{`R$ ${produto[0].valor}`}</h4>}
                                <h6>{`Em até 12x de R$ ${(produto[0].valor/12).toFixed(2)} sem juros`}</h6>
                                <div>
                                    <Button onClick={() => props.addCart(produto[0])}>Adicionar ao carrinho</Button>
                                </div>
                            </div>
                        </Jumbotron>
                    </Col>
                </Row>
            </Container>
            }
        </div>
    );
}

export default Detail;