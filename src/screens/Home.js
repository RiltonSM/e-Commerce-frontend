import React from 'react';

import CarouselSlider from '../components/Carousel';
import CardRow from '../components/CardRow';
import Card from '../components/Cards';
import Loading from './Loading';

import api from '../apis/apiLocal';

class Home extends React.Component {
    state = {
        produtos: [],
        loading: true
    }
    
    componentDidMount(){
        api.get('produtos').then(response => {
            console.log(response.data);
            const newproducts = response.data;
            this.setState({produtos: newproducts, loading: false});
      });  
    }

    render(){
        console.log(this.state.produtos, this.state.loading, process.env.REACT_APP_API_URL);
        return(
            <div>
                {
                    this.state.loading === true ? <Loading /> :
                    <div>
                        <CarouselSlider images={this.props.images}/>
                        <div style={{marginBottom: 100}}>
                            <CardRow produtos={this.state.produtos} first={1} last={4} home={true}/>
                            <CardRow produtos={this.state.produtos} first={5} last={8} home={true}/>
                        </div>
                    </div>
                }
                
            </div>
            
        );
    }
}

export default Home;
