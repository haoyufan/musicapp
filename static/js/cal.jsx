let buttons =[
    {name:'AC',type:1},
    {name:'DEL',type:6},
    {name:'+/-',type:7},
    {name:'/',type:3},
    {name:'7',type:4},
    {name:'8',type:4},
    {name:'9',type:4},
    {name:'*',type:3},
    {name:'4',type:4},
    {name:'5',type:4},
    {name:'6',type:4},
    {name:'-',type:3},
    {name:'1',type:4},
    {name:'2',type:4},
    {name:'3',type:4},
    {name:'+',type:3},
    {name:'%',type:2},
    {name:'.',type:4},
    {name:'0',type:4},
    {name:'=',type:5},
]
class Screen extends React.Component{
    render(){
        return(
            <div className="screen">
                <div className="item">{this.props.data}</div>
            </div>
        )
    }
}

class Key extends React.Component{
    render(){
        let list = this.props.data.map((v,i)=>(
            <li key={i}
                onClick={()=>this.props.number(v)}
                className="item">{v.name}</li>
        ))
        return(
            <div className="opacity">
                {list}
            </div>
        )
    }
}

class Cal extends React.Component{
    constructor(){
        super();
        this.state={
            screenNuber:0,
            flast:'',
            last:'',
            o:''
        }
        this.chage = this.chage.bind(this);
        this.processNumber = this.processNumber.bind(this);
        this.processO = this.processO.bind(this);
        this.processEqal = this.processEqal.bind(this);
        this.processAC = this.processAC.bind(this);
    }
    chage(v){
        if(v.type === 4){
            this.processNumber(v.name);
        }else if(v.type === 3){
            this.processO(v.name);
        }else if(v.type === 5){
            this.processEqal();
        }else if(v.type ===1){
            this.processAC()
        }
    }
    ////////////////////
    processNumber(v){
        if(!this.state.o){
            var first =this.state.flast + v ;
            this.setState({
                flast:first,
                screenNuber:first
            })
        }else{
            let last =v;
            this.setState({
                last:last,
                screenNuber:last
            })
        }
    }
    ////////////////////
    processO(v){
        this.setState({
            o:v,
            screenNuber:v
        })
    }
    ///////////////////
    processEqal(){
        var result;
        if(this.state.o ==='+'){
            result =parseInt(this.state.flast) + parseInt(this.state.last);
        }
        if(this.state.o ==='-'){
            result =this.state.flast - this.state.last;
        }
        if(this.state.o ==='*'){
            result =this.state.flast * this.state.last;
        }
        if(this.state.o ==='/'){
            result =this.state.flast / this.state.last;
        }
        this.setState({
            screenNuber:result,
            first:null,
            last:null,
            o:null
        })
    }
    ///////////////////
    processAC(){
        this.setState({
            screenNuber:0,
            flast:'',
            last:'',
            o:''
        })
    }
    render(){
        return(
            <div id="cal">
                <Screen data={this.state.screenNuber}/>
                <Key data={buttons} number={this.chage}/>
            </div>
        )
    }
}
ReactDOM.render(
    <Cal/>,
    document.querySelector('#container')
)