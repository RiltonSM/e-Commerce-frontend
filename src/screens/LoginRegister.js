import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import api from '../apis/apiLocal';
import viaCep from '../apis/viaCep';

const LoginRegister = props => {
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ cpf, setCpf ] = useState('');
    const [ logradouro, setLogradouro ] = useState('');
    const [ addressNumber, setAddressNumber ] = useState('');
    const [ complement, setComplement ] = useState('');
    const [ cep, setCep ] = useState('');
    const [ district, setDistrict] = useState('');
    const [ city, setCity ] = useState('');
    const [ uf, setUf ] = useState('');
    const [ ddd, setDdd ] = useState('');
    const [ phone, setPhone ] = useState('');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const history = useHistory();

    useEffect(() => {
        if(cep.length === 8){
            viaCep.get(`${cep}/json/unicode`)
                .then(response => {
                    console.log(response)
                    setLogradouro(`${response.data.logradouro}`);
                    setCity(`${response.data.localidade}`);
                    setDistrict(`${response.data.bairro}`);
                    setUf(response.data.uf)
                })
    
        }
    }, [cep])

    const handleLogin = async () => {
        console.log(loginEmail, loginPassword)
        const response = await api.post('user', {
            "password": loginPassword,
            "email": loginEmail
        });
        sessionStorage.setItem("user", JSON.stringify(response.data));
        props.login();
        history.push('/');
    }

    const handleRegister = async () => {
        const response = await api.post('newuser', {
            name,
            email,
            password,
            cpf,
            cep,
            "street": logradouro,
            "number": addressNumber,
            complement,
            district,
            city,
            "state": uf,
            ddd,
            phone
        });
        console.log(response.data);
    }
    return(
        <Container style={{marginBottom: 60}}>
            <Row>
                <Col xs={12} md={6}>
                    <Form>
                        <h1>Entrar</h1>
                        <Form.Group>
                            <Form.Control type="text" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type="password" placeholder="Senha" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Button style={{marginBottom: 30, width: '100%'}} onClick={handleLogin}>Confirmar</Button>
                    </Form>
                </Col>
                <Col xs={12}md={6}>
                    <h2>Ainda não é cadastrado? Preencha os dados abaixo e cadastre-se agora mesmo.</h2>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Endereço de Email</Form.Label>
                            <Form.Control type="email" onChange={e => setEmail(e.target.value)} value={email}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Senha</Form.Label>
                            <Form.Control type="password" onChange={e => setPassword(e.target.value)} value={password}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formBasicName">
                            <Form.Label>Nome completo</Form.Label>
                            <Form.Control type="text" onChange={e => setName(e.target.value)} value={name}/>
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
                            <Form.Control type="text" value={complement} onChange={e => setComplement(e.target.value)}/>
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
                        <Button style={{marginBottom: 30, width: '100%'}} onClick={handleRegister}>Confirmar</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginRegister;