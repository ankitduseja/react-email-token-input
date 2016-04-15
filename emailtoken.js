var Token = React.createClass({
  displayName: 'Token',
  divStyle: {
    float:'left',
    margin:'5px',
    background:'#ccc',
    border: '1px solid #555',
    borderRadius:'5px'
  },
  textStyle: {
    padding:'5px',
    display:'inline-block'
  },
  crossStyle: {
    cursor: 'pointer',
    background: '#555',
    color: '#fff',
    padding: '5px',
    display:'inline-block',
    borderRadius: '0 5px 5px 0'
  },
  highlightStyle: {
    background:'#555',
    color:'#fff'
  },
  deleteToken: function() {
    this.props.deleteToken(this.props.data.text);
    console.log(this.props.data.text)
  },
  render: function() {
    var cls='Token';
    if(this.props.data.highlight) {
      cls+=' highlight';
    }
    return (
      <div className={cls} style={Object.assign({}, this.divStyle, this.props.data.highlight && this.highlightStyle)}>
        <span style={this.textStyle}>{this.props.data.text}</span>
        <span onClick={this.deleteToken} style={this.crossStyle}>X</span>
      </div>
    );
  }
});

var InputBox = React.createClass({
  displayName: 'InputBox',
  divStyle: {
    float:'left',
    padding: '2px',
    margin: '5px',
    font: '14px Arial'
  },
  inputStyle: {
    border: '0px',
    font:'15px Arial',
    height:'22px',
    outline: 'none'
  },
  componentDidMount: function(){
    this.focusTextInput();
  },
  getInitialState: function() {
    return {value: ''};
  },
  focusTextInput:function() {
    this.refs.emailInput.focus();
  },
  handleChange:function(event) {
    var v=event.target.value;
    var that=this;
    var x=(v.indexOf(' ')>=0 || v.indexOf(',')>=0);

    if(x==true) {
      console.log(x);
      var emails=v.split(/,| /);
      var i;
      for(i=0;i<emails.length;i++) {
        var isValid=this.validateEmail(emails[i]);
        console.log(this);
        console.log(emails[i]+' is valid:'+isValid);
        if(isValid===true) {
          this.addToken(emails[i]);
          console.log("Adding: "+emails[i]);
        }
      }
      this.setState({value: ''});
      this.props.changeInputText('');
    } else {
      this.setState({value: v});
      this.props.changeInputText(v);
    }
  },
  checkTokenRemoval: function() {
    if(this.state.value.length==0) {
      this.props.backToken();
    }
  },
  validateEmail: function(email) {
    if(email.length>0) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } else {
      return false;
    }
  },
  addToken: function(token) {
    console.log(token);
    this.props.addToken(token);
  },
  keyDown: function(event){
    switch(event.keyCode){
      case 13: //enter
      case 32: //space
      case 188: //comma
        event.preventDefault();
        if(this.validateEmail(this.state.value)) {
          this.addToken(this.state.value);
        } else {
          alert('Invalid Email');
        }
        this.setState({value: ''});
      break;
      case 8: //backspace
        this.checkTokenRemoval();
      break;
      default:
        // console.log(event.keyCode);
    }
  },
  render: function() {
    return (
      <div className='InputBox' style={this.divStyle}>
        <input ref='emailInput' style={this.inputStyle} type='text' value={this.state.value} onKeyDown={this.keyDown} onChange={this.handleChange}/>
      </div>
    );
  }
});

var TokenBox = React.createClass({
  displayName: 'TokenBox',
  divStyle: {
    border: '1px solid #ccc',
    width: '500px',
    height: 'auto',
    minHeight: '100px',
    font: '14px Arial',
    cursor: 'text'
  },
  clearStyle: {
    clear:'both'
  },
  getInitialState: function() {
    return { tokens: [], inputText:'' };
  },
  onTokenAdded: function(newToken) {
    newToken=newToken.toLowerCase()
    var t=this.state.tokens;
    var newT=true;
    var i=0;
    for(i=0;i<t.length;i++) {
      if(t[i].text==newToken) {
        newT=false;
        return false;
      }
    }
    if(newT) {
      t.push({text:newToken,highlight:false});
      this.setState({ tokens: t });
    }
  },
  changeHightlight:function(h) {
    var ta=this.state.tokens;
    if(ta && ta.length>0) {
      var lastToken=ta[ta.length-1];
      if(!h) {
        ta[ta.length-1].highlight=h;
      } else {
        if(lastToken && lastToken.highlight) {
          //delete
          ta.pop();
        } else {
          ta[ta.length-1].highlight=h;
        }
      }
      this.setState({ tokens: ta });
    }
  },
  onBackKey: function() {
    this.changeHightlight(true);
  },
  onInputTextChange: function(text) {
    this.setState({ inputText: text });
    if(text.length>0)
    this.changeHightlight(false);
  },
  onClicked: function() {
    this.inputBox.focusTextInput();
  },
  onTokenDelete:function(token) {
    var t=this.state.tokens.slice();
    var match=false;
    var i;
    for(i=0;i<t.length;i++) {
      if(t[i].text==token) {
        match=i+1;
      }
    }
    if(match) {
      var to = this.state.tokens.filter(function(t) { return t.text != token });
      this.setState({ tokens: to });
    }
  },
  render: function() {
    return (
      <div className='TokenBox' style={this.divStyle} onClick={this.onClicked}>
        {this.state.tokens.map(function(t) {
          return <Token deleteToken={this.onTokenDelete} key={t.text} data={t}/>;
        }.bind(this))}
        <InputBox ref={(ref) => this.inputBox = ref} changeInputText={this.onInputTextChange} addToken={this.onTokenAdded} backToken={this.onBackKey} />
        <div style={this.clearStyle}/>
      </div>
    );
  }
});

ReactDOM.render(
  React.createElement(TokenBox, null),
  document.getElementById('example')
);
