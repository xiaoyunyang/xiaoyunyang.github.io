var dataset = "hello";
var user = "xyang";

function loadUserData() {
  var filePath = "assets/data/profile/"+user+".json";
  d3.json(filePath, function(error, json) {
    if(error) return console.warn("failed to load tagfilter:  "+error);
    dataset = json;
    render();
  });

}
function render() {
  var SideNav = React.createClass({ 
    getInitialState: function() { 
      return { 
        user: dataset.user,
        binders: [],
        tags: []
      }
    },
    componentWillMount: function(){ //constructor
      this.setState(
        { 
          user: dataset.user,
          binders: dataset.binders,
          tags: dataset.tags,
        }  
      );
    },
    componentDidMount: function() {
      $('.collapsible').collapsible();
    },
    render: function () { 
      return (
        <div className="perm side-nav fixed">
          <ul className="collection with-header">
              <li className="collection-header" id="user-info">{this.state.user.name}</li>
          </ul>
          <ul className="collapsible" data-collapsible="expandable">
            <SideBinders binders={this.state.binders}/>
            <SideTags tags={this.state.tags}/>
          </ul>
        </div>

      );
    }
  });
  
  ReactDOM.render(<TopNav/>, document.getElementById('react-top-nav'));
  ReactDOM.render(<SideNav/>, document.getElementById('react-side-nav'));
}

$(document).ready(function () {
  $('.carousel').carousel();
  $('select').material_select();
  $('.button-collapse').sideNav({
      edge: 'right',
      closeOnClick: true
    });
  $('.collapsible').collapsible({
    accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
  });
  loadUserData();
  
});

var SideBinders = React.createClass({ 
  render: function () { 
    return (
      <li>
        <div className="collapsible-header active">DataVis</div>
        <div className="collapsible-body">
          <ul className="collection with-header valign pills"> {
            this.props.binders.map(function(item) {
              return (
                <li key={item.alias} className={"collection-item "+item.alias+"-pill"}><a href={"#"+item.alias}>{item.name}</a></li>
              );
            })
          }</ul>
        </div>
      </li>
    );
  }
});

var SideTags = React.createClass({ 
  render: function () { 
    return (
      <li>
        <div className="collapsible-header active">Blog</div>
        <div className="collapsible-body">
          <ul className="collection with-header valign"> {
            this.props.tags.map(function(item) {
              return (
                <li key={item.tag} className="collection-item"><a href="">#{item.tag}</a></li>
              );
            })
          }</ul>
        </div>
      </li>
    );
  }
});
var TopNav = React.createClass({
  componentDidMount: function() {
    $('.button-collapse').sideNav({
      edge: 'right',
      closeOnClick: true
    });
  },
  render: function() {
    return (
      <nav className=" grey lighten-4">
        <div className="nav-wrapper">
          <a href="#" data-activates="mobile-menu" className="button-collapse right"><i className="mdi-navigation-menu"></i></a>
          <a href="#!" className="brand-logo">Xiaoyun Yang</a>
          <ul className="pills right hide-on-med-and-down">
            <li className="home-pill"><a href="#home">Home</a></li>
            <li className="life-pill"><a href="#life">Life</a></li>
            <li className="writing-pill"><a href="#writing">Writing</a></li>
            <li className="about-pill"><a href="#about">About</a></li>
            <li className="contact-pill"><a href="#contact">Contact</a></li>
          </ul>
          <ul className="pills side-nav" id="mobile-menu">
            <li className="home-pill"><a href="#home">Home</a></li>
            <li className="life-pill"><a href="#life">Life</a></li>
            <li className="writing-pill"><a href="#writing">Writing</a></li>
            <li className="about-pill"><a href="#about">About</a></li>
            <li className="contact-pill"><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>
    );
  }
});