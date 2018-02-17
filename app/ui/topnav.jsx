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
              <li className="work-pill"><a href="#work">Work</a></li>
              <li className="about-pill"><a href="#about">About</a></li>
              <li className="resume-pill"><a href="#resume">Resume</a></li>
              <li className="writing-pill"><a href="#writing">Writing</a></li>
              <li>
                <a href="#" className="navbar-img dropdown-button" data-activates="user-dropdown">
                  <img className="mod-round" src={this.props.picUrl}/>
                  <div className="arrow-down"></div>
                </a>
                <ul id="user-dropdown" className="dropdown-content">
                  <li>
                    <a target="_blank" href="https://github.com/xiaoyunyang">
                      <i className="fa fa-github"></i>  Github
                    </a>
                  </li>
                  <li>
                    <a target="_blank" href="https://www.linkedin.com/in/xiaoyun-yang-380a9874">
                      <i className="fa fa-linkedin"></i> Linkedin
                    </a>
                  </li>
                  <li>
                    <a target="_blank" href="https://medium.com/@xiaoyunyang">
                      <i className="fa fa-medium"></i> Medium
                      </a>
                  </li>
                  <li>
                    <a href="mailto:xiaoyun@looseleafapp.com">
                      <i className="fa fa-envelope"></i> Email
                    </a>
                  </li>
                  <li className="divider"></li>
                  <li><a href="/serverless-webapp/apps/100days.html">{"100days"}</a></li>
                  <li><a href="/serverless-webapp/apps/url-builder.html">{"url-builder"}</a></li>
                  <li><a href="/serverless-webapp/apps/query-builder.html">{"query-builder"}</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
});
