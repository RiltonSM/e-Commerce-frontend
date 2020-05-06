import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Table, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom'

import Loading from './Loading';
import api from '../apis/apiLocal';


function Pay(props){
    const [ loading, setLoading ] = useState(false);
    const [ nome, setNome ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ cpf, setCpf ] = useState('');
    const [ ncc, setNcc ] = useState('');
    const [ nomeTitular, setNomeTitular ] = useState('');
    const [ logradouro, setLogradouro ] = useState('');
    const [ addressNumber, setAddressNumber ] = useState('');
    const [ complemento, setComplemento ] = useState('');
    const [ cep, setCep ] = useState('');
    const [ district, setDistrict] = useState('');
    const [ city, setCity ] = useState('');
    const [ uf, setUf ] = useState('');
    const [ ddd, setDdd ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ cvv, setCvv ] = useState('');
    const [ flag, setFlag ] = useState('');
    const [ mes, setMes ] = useState('');
    const [ ano, setAno ] = useState('');
    const [ owner, setOwner] = useState(false);
    const [ bdate, setBdate ] = useState('');
    const [ ownerCpf, setOwnerCpf ] = useState('');
    const [ ownerDdd, setOwnerDdd ] = useState('');
    const [ ownerPhone, setOwnerPhone ] = useState('');
    const [ parc, setParc ] = useState([]);
    const [ nparc, setNparc ] = useState('');
    const [ pparc, setPparc ] = useState('');
    const [ ctoken, setCtoken ] = useState('');
    const [ hash, setHash ] = useState('');        

    const history = useHistory();

    useEffect(() => {
        if(props.isLogged === false){
            history.push('/login')
        }else{
            api.get('getId').then(id => {
                window.PagSeguroDirectPayment.setSessionId(id.data);
            });
            
            setEmail(props.user[0].email);
            setNome(props.user[0].name);
            setCpf(props.user[0].cpf);
            setCep(props.user[0].cep);
            setLogradouro(props.user[0].street);
            setComplemento(props.user[0].complement);
            setDistrict(props.user[0].district);
            setCity(props.user[0].city);
            setUf(props.user[0].state);
            setDdd(props.user[0].ddd);
            setPhone(props.user[0].phone);
            setAddressNumber(props.user[0].number)
        }
    }, []);

    useEffect(() => {  
        if(ncc.length === 6){
            window.PagSeguroDirectPayment.getBrand({
                cardBin: ncc,
                success: function(response){
                    setFlag(response.brand.name);
                }
            });
        }
        window.PagSeguroDirectPayment.onSenderHashReady(function(response){
            if(response.status == 'error') {
                console.log(response.message);
                return false;
            }
            setHash(response.senderHash); //Hash estará disponível nesta variável.
        })
    }, [ncc]);

    useEffect(() => {
        console.log(hash);
        if(flag.length !== 0){
            window.PagSeguroDirectPayment.getInstallments({
                amount: props.total,
                maxInstallmentNoInterest: 3,
                brand: flag,
                success: function(response){
                    setParc(response.installments[`${flag}`]);
                },
                error: function(response){
                    console.log(response);
                }
            });
        }
    }, [flag]);

    useEffect(() => {
        if(owner === true){
            setOwnerCpf(cpf);
            setOwnerDdd(ddd);
            setOwnerPhone(phone);
        }
    }, [owner])

    useEffect(() => {
        
        const birthD = bdate.split('-');
        let products = {
            id: [],
            quantity: []
        };
        props.cart.map(element => {
            products.id.push(element.id);
            products.quantity.push(element.quantidade)
        });
        const user = JSON.parse(sessionStorage.getItem('user'));
        if(ctoken !== ''){
            setLoading(true);
            api.post('saveCart', {
                'products': JSON.stringify(products.id),
                'quantity': JSON.stringify(products.quantity),
                'userId': user[0].id,
                'userHash': hash,
                'total': (nparc * pparc).toFixed(2)
            }).then(response => {
                console.log(response.data[0].id);
                api.post('finish', {
                    payment: {
                        mode: 'default',
                        method: 'creditCard',
                        currency: 'BRL',
                        sender: {
                            hash: hash,
                            name: nome,
                            email: email,
                            phone: {
                                areaCode: ownerDdd,
                                number: ownerPhone,
                            },
                            documents: {
                                type: 'CPF',
                                value: cpf,
                            },
                        },
                        item: {
                            id: JSON.parse(response.data[0].id),
                            amount: props.total,
                            quantity: '1'
                        },
                        creditCard: {
                            token: ctoken
                        },
                        installment: {
                            quantity: nparc,
                            value: pparc,
                            noInterestInstallmentQuantity: 3
                        },
                        holder: {
                            name: nomeTitular,
                            document: {
                                type: 'CPF',
                                value: ownerCpf,
                            },
                            birthDate: `${birthD[2]}/${birthD[1]}/${birthD[0]}`,
                            phone: {
                                areaCode: ownerDdd,
                                number: ownerPhone
                            },
                        },
                        billingAddress: {
                            street: logradouro, //80 caracteres
                            number: addressNumber,
                            district: district, //60 carac
                            city: city, //min 2 e max 60 carac
                            state: uf, //UF - 2 letras
                            country: 'BRA',
                            postalCode: cep, //number - 8 digitos
                            complement: complemento, //40 carac
                        },
                        shipping: {
                            addressRequired: false
                        }
                    } 
                }).then(response => {
                    console.log(response.data)
                    const user = JSON.parse(sessionStorage.getItem('user'));
                    const oldCodes = JSON.parse(user[0].purchases);
                    let newCode = [];
                    if(oldCodes !== null){
                        oldCodes.map(code => newCode.push(code));
                    }
                    console.log(newCode);
                    newCode.push(response.data.code._text);
                    console.log(user[0].cpf, newCode)
                    api.put('purchased', {
                        cpf: user[0].cpf,
                        codes: JSON.stringify(newCode)
                    }).then(response => {
                        sessionStorage.setItem('user', JSON.stringify(response.data));
                    });
                    api.put('addCode', {
                        "code": response.data.code._text,
                        "userHash": hash
                    }).then(() => {
                        props.cleanCart();
                        history.push('/');
                    })
                })
            })
            
        }
        
    }, [ctoken])

    const handleConfirm = () => {
        window.PagSeguroDirectPayment.createCardToken({
            cardNumber: ncc,
            brand: flag,
            cvv: cvv,
            expirationMonth: mes,
            expirationYear: ano,
            success: function (response){
                setCtoken(response.card.token);
            },
            error: function(response){
                console.log(response)
            }
        })
    }

    const handleParcelas = e => {
        let parcela = e - 1;
        setPparc(parc[`${parcela}`].installmentAmount.toFixed(2));
        console.log(pparc);
        setNparc(e);
    }

    return(
        loading ? <Loading /> :
        <Container style={{marginBottom: 100}}>
            <h3>Ok, vamos finalizar sua compra, mas primeiro preciso de algumas informações</h3>
            <Row>
                <Col>
                    <h3>Informações pessoais</h3>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Endereço de Email</Form.Label>
                            <Form.Control type="email" onChange={e => setEmail(e.target.value)} value={email}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicName">
                            <Form.Label>Nome completo</Form.Label>
                            <Form.Control type="text" onChange={e => setNome(e.target.value)} value={nome}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicCPF">
                            <Form.Label>CPF</Form.Label>
                            <Form.Control type="text" maxLength="11" placeholder="Ex.: 00000000000" onChange={e => setCpf(e.target.value)} value={cpf}/>
                            <Form.Text>Somente números</Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicAddressCEP">
                            <Form.Label>CEP</Form.Label>
                            <Form.Control type="text" placeholder="Ex.: 60000000" maxLength="8" value={cep} onChange={e => setCep(e.target.value)}/>
                        </Form.Group>
                        <Form.Row>
                            <Form.Group controlId="formBasicAddress" style={{width: '80%', marginLeft: '1%'}}>
                                <Form.Label>Logradouro</Form.Label>
                                <Form.Control type="text" value={logradouro} onChange={e => setLogradouro(e.target.value)}/>
                            </Form.Group>
                            <Form.Group controlId="formBasicAddressNumber" style={{width: '15%', marginLeft: '3%'}}>
                                <Form.Label>Número</Form.Label>
                                <Form.Control type="text" value={addressNumber} onChange={e => setAddressNumber(e.target.value)}/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlId="formBasicAddressCompl" >
                            <Form.Label>Complemento</Form.Label>
                            <Form.Control type="text" value={complemento} onChange={e => setComplemento(e.target.value)}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicAddressDistrict">
                            <Form.Label>Bairro</Form.Label>
                            <Form.Control type="text" value={district} onChange={e => setDistrict(e.target.value)}/>
                        </Form.Group>
                        <Form.Row>
                            <Form.Group controlId="formBasicAddressCity" style={{width: '80%', marginLeft: '1%'}}>
                                <Form.Label>Cidade</Form.Label>
                                <Form.Control type="text" value={city} onChange={e => setCity(e.target.value)}/>
                            </Form.Group>
                            <Form.Group controlId="formBasicAddressState" style={{width: '15%', marginLeft: '3%'}}>
                                <Form.Label>UF</Form.Label>
                                <Form.Control as="select" value={uf} onChange={e => setUf(e.target.value)}>
                                    <option></option>
                                    <option>AC</option>
                                    <option>AL</option>
                                    <option>AP</option>
                                    <option>AM</option>
                                    <option>BA</option>
                                    <option>CE</option>
                                    <option>DF</option>
                                    <option>ES</option>
                                    <option>GO</option>
                                    <option>MA</option>
                                    <option>MT</option>
                                    <option>MS</option>
                                    <option>MG</option>
                                    <option>PA</option>
                                    <option>PB</option>
                                    <option>PR</option>
                                    <option>PE</option>
                                    <option>PI</option>
                                    <option>RJ</option>
                                    <option>RN</option>
                                    <option>RS</option>
                                    <option>RO</option>
                                    <option>RR</option>
                                    <option>SC</option>
                                    <option>SP</option>
                                    <option>SE</option>
                                    <option>TO</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group style={{width: '15%', marginRight: '3%', marginLeft: '1%'}}>
                                <Form.Label>DDD</Form.Label>
                                <Form.Control type="text" maxLength="2" placeholder="Ex.: 11" value={ddd} onChange={e => setDdd(e.target.value)}></Form.Control>        
                            </Form.Group>
                            <Form.Group style={{width: '80%'}}>
                                <Form.Label>Telefone</Form.Label>
                                <Form.Control type="text" minLength="8" maxLength="9" placeholder="Ex.: 000000000" value={phone} onChange={e => setPhone(e.target.value)}></Form.Control>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Col>
                <Col>
                    <h3>Informações do cartão</h3>
                    <Form>
                        <Form.Group>
                            <Form.Row style={{marginLeft: 1, alignItems: 'center'}}>
                                <Form.Label style={{fontSize: 18, marginBottom: 0, marginRight: "7%"}}>Este cartão é seu?</Form.Label>
                                <Form.Check 
                                    type="switch"
                                    id="custom-switch"
                                    style={{fontSize: 18, alignItems: 'center'}}
                                    label={owner ? 'Sim' : 'Não'}
                                    onClick={() => setOwner(!owner)}
                                />
                            </Form.Row>
                        </Form.Group>
                        
                        <Form.Group controlId="formBasicNumberCard">
                            <Form.Label>Cartão de Crédito</Form.Label>
                            <Row>
                                <Col xs={10}>
                                    <Form.Control type="text" maxLength="16" minLength="14" onChange={e => setNcc(e.target.value)} value={ncc}/>
                                </Col>
                                <Col xs={2}>
                                    {
                                        flag !== '' ? 
                                        <img src={require(`../images/bandeiras/${flag}.png`)} width={50} height={35}/>:
                                        <span />
                                    }
                                    
                                </Col>
                                
                            </Row>
                            
                        </Form.Group>
                        <Form.Group controlId="formBasicNameCard">
                            <Form.Label>Nome do titular</Form.Label>
                            <Form.Control type="text" onChange={e => setNomeTitular(e.target.value)} value={nomeTitular}/>
                            <Form.Text>Da forma escrita no cartão</Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicBDate">
                            <Form.Label>Data de nascimento do titular</Form.Label>
                            <Form.Control type="date" onChange={e => setBdate(e.target.value)} value={bdate}/>
                            <Form.Text>Somente números</Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicCVVCard">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control type="text" maxLength="3" onChange={e => setCvv(e.target.value)} value={cvv}/>
                            <Form.Text>Os números no versão do cartão</Form.Text>
                        </Form.Group>
                        <Form.Row style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Form.Group controlId="formBasicMesCard" style={{width: '40%', marginLeft: 4}}>
                                <Form.Label>Mês</Form.Label>
                                <Form.Control type="text" maxLength="2" onChange={e => setMes(e.target.value)} value={mes}/>
                                <Form.Text>Validade do cartão</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicAnoCard" style={{width: '40%', marginRight: 5}}>
                                <Form.Label>Ano</Form.Label>
                                <Form.Control type="text" maxLength="4" onChange={e => setAno(e.target.value)} value={ano}/>
                            </Form.Group>
                        </Form.Row>
                        {
                            owner ? <span/> : 
                            <div>
                                <Form.Group controlId="formBasicCPF">
                                    <Form.Label>CPF do titular</Form.Label>
                                    <Form.Control type="text" maxLength="11" placeholder="Ex.: 00000000000" onChange={e => setOwnerCpf(e.target.value)} value={ownerCpf}/>
                                    <Form.Text>Somente números</Form.Text>
                                </Form.Group>
                                <Form.Label>Contato do titular</Form.Label>
                                <Form.Row>
                                    <Form.Group style={{width: '15%', marginRight: '3%', marginLeft: '1%'}}>
                                        <Form.Label>DDD</Form.Label>
                                        <Form.Control type="text" maxLength="2" placeholder="Ex.: 11"></Form.Control>
                                    </Form.Group>
                                    <Form.Group style={{width: '80%'}}>
                                        <Form.Label>Telefone</Form.Label>
                                        <Form.Control type="text" minLength="8" maxLength="9" placeholder="Ex.: 000000000"></Form.Control>
                                    </Form.Group>
                                </Form.Row>              
                            </div>
                            
                        }
                        
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>
                                    Produto
                                </th>
                                <th>
                                    Quantidade
                                </th>
                                <th>
                                    Preço
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.cart.map((produto, i) => (
                                    <tr key={i}>
                                        <td>{produto.nome}</td>
                                        <td>{produto.quantidade}</td>
                                        <td>R$ {(produto.quantidade * produto.valor).toFixed(2)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        
                    </Table>
                    
                </Col>
            </Row>
            <Form>
                <Form.Group>
                    <Form.Label>Parcelamento</Form.Label>
                    <Form.Control as="select"  onChange={(e) => handleParcelas(e.target.value)}>
                        <option>Selecione o parcelamento</option>
                        {
                            parc !== [] ?
                                
                                parc.map(parcela => {
                                    return (
                                        <option value={parcela.quantity} key={parcela.quantity}>{`${parcela.quantity}x de R$ ${parcela.installmentAmount.toFixed(2)} = R$ ${parcela.totalAmount.toFixed(2)}`}</option>
                                    )
                                })
                            :
                                <option>Aguardando Preenchimento das informações</option>
                        }
                    </Form.Control>
                </Form.Group>
            </Form>
            <Button onClick={handleConfirm}>Realizar pagamento</Button>
        </Container>
    );
}

export default Pay;