var TopNav = React.createClass({
  componentDidMount: function(){
    $(".button-collapse").sideNav();
    closeOnClick: true;
  },
  render: function() {
    return (
      <nav className=" grey lighten-4">
        <div className="nav-wrapper">

          <a href="#!" className="brand-logo">{this.props.profileName}</a>
          <ul className="pills hide-on-med-and-down">
            <li className="bookmarks-pill"><a href="#bookmarks">Bookmarks</a></li>
            <li className="about-pill"><a href="#about">About</a></li>
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
    );
  }
});
