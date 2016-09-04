var TopNav = React.createClass({
  componentDidMount: function(){
    $(".button-collapse").sideNav({
      edge: 'left',
      closeOnClick: true
    });
    $(".dropdown-button").dropdown();
  },
  render: function() {
    return (
      <div className="navbar-fixed">
        <nav className=" grey lighten-4">
          <div className="nav-wrapper-white nav-text-links">
            <a href="#!" className="brand-logo">{this.props.profileName}</a>
            <ul className="pills right hide-on-med-and-dow">
              <li className="about-pill"><a href="#about">Home</a></li>

              <li className="bookmarks-pill"><a href="#bookmarks">Notebooks</a></li>
              <li><a href="#about"><i className="material-icons">school</i></a></li>
              <li><a href="#about"><i className="material-icons">notifications_none</i></a></li>
              <li>
                <a href="#user-dropdow" className="navbar-img dropdown-button" data-activates="user-dropdown">
                  <img className="mod-round" src={this.props.picUrl}/>
                </a>
                <ul id="user-dropdown" className="dropdown-content">
                  <li><a href="#!">New Bookmark</a></li>
                  <li><a href="#!">New Notebook</a></li>
                  <li className="divider"></li>
                  <li><a href="#!">Profile</a></li>
                  <li className="divider"></li>
                  <li><a href="#!">Log out</a></li>
                </ul>
              </li>
            </ul>

            <a href="#" data-activates="mobile-menu" className="button-collapse left"><i className="mdi-navigation-menu"></i></a>
            <ul className="pills side-nav left-aligned" id="mobile-menu">
              <li className=""><a href="dashboard.html">LooseLeaf</a></li>
              <li className=""><a href="user-xyang.html">Xiaoyun</a></li>
              <li className=""><a href="user-afenner.html">Andrew</a></li>
              <li className=""><a href="user-numbershapes.html">NumberShapes</a></li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
});
