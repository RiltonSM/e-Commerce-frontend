import React from 'react';
import { Carousel, Image } from 'react-bootstrap';
import next from '../images/baseline_arrow_forward_ios_black_18dp.png';
import prev from '../images/baseline_arrow_back_ios_black_18dp.png';

class CarouselSlider extends React.Component {
    render(){
        console.log(this.props.images.path);
        return(
            <div>
                <Carousel 
                    prevIcon={<Image src={prev}/>}
                    nextIcon={<Image src={next}/>}
                >
                    <Carousel.Item>
                        <div className="d-flex justify-content-center">
                            <img className="img-fluid"
                                src={this.props.images.path[1]} 
                                //style={{maxWidth: 1264, maxHeight: 315}}
                            /> 
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className="d-flex justify-content-center">
                            <img className="img-fluid"
                                src={this.props.images.path[2]} 
                                //style={{maxWidth: 1264, maxHeight: 315}}
                            /> 
                        </div>
                    </Carousel.Item>
                </Carousel>
            </div>
            
        );
    }
}

export default CarouselSlider;