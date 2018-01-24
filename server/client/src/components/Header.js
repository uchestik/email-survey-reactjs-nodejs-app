import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Payments from './Payments'

class Header extends Component{

    renderContent(){
        switch(this.props.auth){
            case null:
                return; //we dont want to show anything
            case false:
                return (
                    <li><a href='/auth/google'>Login With Google</a></li>
                )
            default:
                return[ //note that we are returning an array. new in javascript

                    <li key='1'><Payments /></li>,
                    <li style={{margin:'0 10px'}} key='3'>Credits: {this.props.auth.credits}</li>,
                    <li key='2'><a href='/api/logout'>Logout</a></li>
                ]
            }
    }

    render(){
        return(
            <nav>
                <div className='nav-wrapper'>
                    <Link to={this.props.auth ? '/surveys':'/'}  
                    className='left brand-logo'
                    >
                        Emaily
                    </Link>
                    <ul className='right'>
                        {this.renderContent()}
                    </ul>
                </div>
            </nav>
        )
    }
}

function mapStateToProps({auth}){
    return{  auth  }
}

export default connect(mapStateToProps)(Header);