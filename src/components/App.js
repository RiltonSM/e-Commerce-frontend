import React from 'react';
import { 
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory
} from 'react-router-dom';

import Home from '../screens/Home';
import Detail from '../screens/Detail';
import Cart from '../screens/Cart';
import Pay from '../screens/Pay';
import LoginRegister from '../screens/LoginRegister';
import Category from '../screens/Category';
import MyRequest from '../screens/MyRequest';
import OrderDetail from '../screens/OrderDetail';
import Loading from '../screens/Loading';

import Header from '../components/Header';
import Footer from '../components/Footer';

import api from '../apis/apiLocal';

const menu = {
    brand: "Rilton Store",
    link: {
        1: 'Promoções',
    },
    dropdown: {
        titulo: 'Produtos',
        1: 'Notebooks',
        2: 'PC Gamers',
        3: 'Tablets'
    } 
}

const images = {
    path: {
        1: require("../images/imagem1.png"),
        2: require('../images/imagem2.png'),
        3: require('../images/imagem3.png')
    }
}

let total = null;
let carr = localStorage.getItem('cart');
console.log(carr);
class App extends React.Component {
    state = {
        cart: carr === null ? [] : JSON.parse(carr),
        total: 0,
        produtoAtivo: null,
        session: sessionStorage.getItem('user') ? true : false,
        loading: true
    }
    

    componentDidUpdate(){
        if(total !== this.state.total){
            this.setState({total: this.calcCart()})
            total = this.state.total;
        } else {
            total = null;
        }
    }

    logout = history => {
        this.setState({session: false});
        sessionStorage.clear();
        history.push('/');
    }

    login = () => {
        this.setState({session: true});
    }

    addCart = produto => {
        let newCart = [];
        newCart = this.state.cart;
        newCart.push(produto);
        localStorage.setItem('cart',JSON.stringify(newCart)); 
        this.setState({cart: newCart})
    }

    removeCart = i => {
        let newCart = [];
        newCart = this.state.cart;
        newCart.splice(i, 1);
        localStorage.setItem('cart',JSON.stringify(newCart)); 
        this.setState({cart: newCart})
    }

    cleanCart = () => {
        localStorage.removeItem('cart');
        this.setState({ cart: []});
    }
    addQuant = i => {
        let newCart = [];
        newCart = this.state.cart;
        newCart.map((produto, j) => {
            if(i === j){
                produto.quantidade++;
            }
        });
        localStorage.setItem('cart',JSON.stringify(newCart)); 
        this.setState({cart: newCart});
    }

    subQuant = i => {
        let newCart = [];
        newCart = this.state.cart;
        newCart.map((produto, j) => {
            if(i === j){
                if(produto.quantidade === 1){
                    return
                } else{
                    produto.quantidade--;
                }
            }
        });
        localStorage.setItem('cart',JSON.stringify(newCart)); 
        this.setState({cart: newCart});
    }

    calcCart = () => {
        let total = 0;
        let cart = this.state.cart;
        cart.forEach(produto => {
            total = total + (produto.valor * produto.quantidade);
        });
        console.log(total);
        return total;
        
    }

    render(){
        console.log(this.state);
        return(
            <div className="w-100 h-100" style={{overflowX: 'hidden'}}>
                <Router>
                <Header info={menu} number={this.state.cart.length} session={this.state.session} logout={this.logout}/>
                    <Switch>
                        <Route path= {`/detail/:${this.state.produtoAtivo}`}>
                            <Detail 
                                addCart={this.addCart}
                            />
                        </Route>
                        <Route path="/" exact>
                            <Home 
                                images={images}
                            />
                        </Route>
                        <Route path="/cart" exact>
                            <Cart 
                                cart={this.state.cart}
                                total={this.state.total}
                                addQuant={this.addQuant} 
                                subQuant={this.subQuant} 
                                removeCart={this.removeCart}
                            />
                        </Route>
                        <Route path='/pay' exact>
                            <Pay 
                                cart={this.state.cart}
                                total={this.state.total.toFixed(2)}
                                user={JSON.parse(sessionStorage.getItem('user'))}
                                cleanCart = {this.cleanCart}
                                isLogged={this.state.session}                                
                            />
                        </Route>
                        <Route path='/login'>
                            <LoginRegister  login={this.login}/>
                        </Route>
                        <Route path="/category/:id">
                            <Category
                                produtos={this.state.produtos}
                            />
                        </Route>
                        <Route path="/requests" exact>
                            <MyRequest 
                                isLogged={this.state.session}
                            />
                        </Route>
                        <Route path="/requests/detail/:id">
                            <OrderDetail />
                        </Route>
                    </Switch>
                    <Footer/>
                </Router>
            </div>
        );
    }
}

export default App;