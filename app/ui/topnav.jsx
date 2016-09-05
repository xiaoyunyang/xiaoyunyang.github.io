var TopNav = React.createClass({
  componentDidMount: function(){
    $(".dropdown-button").dropdown();
  },
  render: function() {
    return (
      <div className="navbar-fixed">
        <nav className=" grey lighten-4">
          <div className="nav-wrapper-white nav-text-links">
            <ul className="right pills">
              <li className="about-pill"><a href="#about">About</a></li>
              <li className="notebooks-pill"><a href="#notebooks">Notebooks</a></li>
              <li><a href=""><i className="material-icons">school</i></a></li>
              <li><a href=""><i className="material-icons">notifications_none</i></a></li>
              <li>
                <a href="#" className="navbar-img dropdown-button" data-activates="user-dropdown">
                  <img className="mod-round" src={this.props.picUrl}/>
                  <div className="arrow-down"></div>
                </a>

                <ul id="user-dropdown" className="dropdown-content">
                  <li><a href="#!">New Note</a></li>
                  <li><a href="#!">New Notebook</a></li>
                  <li className="divider"></li>
                  <li><a href="#!">Profile</a></li>
                  <li className="divider"></li>
                  <li><a href="#!">Log out</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
});
