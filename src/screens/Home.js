import React from 'react';

import CarouselSlider from '../components/Carousel';
import CardRow from '../components/CardRow';

class Home extends React.Component {
   
    render(){
        return(
            <div>
                <CarouselSlider images={this.props.images}/>
                <div style={{marginBottom: 100}}>
                    <CardRow produtos={this.props.produtos} first={2} last={5} home={true}/>
                    <CardRow produtos={this.props.produtos} first={6} last={9} home={true}/>
                </div>
            </div>
            
        );
    }
}

export default Home;
