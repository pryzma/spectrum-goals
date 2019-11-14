

//import React from 'react';
//import ReactDOM from 'react-dom';

if(!React){
    console.warn("React is not available")
}

class Interface extends React.Component {
    constructor(props){
        super(props)
        this.state = {}
    }
    render(){
        return (
            <></>
        )
    }
}

class Viewport extends React.Component {
    constructor(props){
        super(props)
        this.state = {}
    }
    render(){
        return (
            <></>
        )
    }
}
class NavItem extends React.Component {
    constructor(props){
        super(props)
        this.state = {}
    }
    componentDidMount(){

    }
    render(){
        return (
            <></>
        )
    }
}

class Nav extends React.Component {
    constructor(props){
        super(props)
        this.state = {}
    }
    render(){
        return (
            <></>
        )
    }
}
application.React = (options) => {
    const target = options.target ? options.target : document.getElementById('root')
    ReactDOM.render(options.component,target)
}
