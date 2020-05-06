import React from 'react';
import { Row, CardDeck} from 'react-bootstrap';
import Cards from './Cards';

const CardRow = props => {

    return(
        <Row className="justify-content-center" style={styles.container}>
            <CardDeck>
                {   
                    props.home ? 
                    props.produtos.filter(produto => {
                        return produto.id >= props.first && produto.id <= props.last
                    }).map(produto => {
                       return <Cards key={produto.id} produto={produto}/>
                    })
                    :
                    props.produtos.filter(produto => {
                        return produto.categoria === props.id
                    }).map(produto => {
                       return <Cards key={produto.id} produto={produto}/>
                    })
                }
            </CardDeck>
        </Row>
    )
}

const styles = {
    container: {
        marginTop: 20,
        marginBottom: 20
    }
}

export default CardRow;