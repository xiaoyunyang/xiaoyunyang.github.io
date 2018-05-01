var TopNav = React.createClass({
  componentDidMount: function() {
    $(".bars").sideNav();
  },
  render: function() {
    return (<div>
        <div className="navbar-fixed">
          <nav className=" grey lighten-4">
            <div className="nav-wrapper-white nav-text-links">
              <ul className="left">
                <li>
                  <a href="#" data-activates="slide-out" className="bars"><i className="fa fa-bars"></i></a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <ul id="slide-out" className="side-nav">
          <li>
            <div className="user-view">
              <div className="background">
                <img src="../assets/images/table3.png"/>
               </div>
               <img className="circle" src="https://avatars3.githubusercontent.com/u/5825343?s=460&v=4"/>
               <div className="row">
                 <div className="col l2 m2 s2">
                   <a href="https://github.com/xiaoyunyang"><i className="fab fa-github fa-lg"></i></a>
                 </div>
                 <div className="col l2 m2 s2">
                   <a href="https://www.linkedin.com/in/xiaoyun-yang"><i className="fab fa-linkedin fa-lg"></i></a>
                 </div>
                 <div className="col l2 m2 s2">
                   <a href="https://medium.com/@xiaoyunyang"><i className="fab fa-medium fa-lg"></i></a>
                 </div>
                 <div className="col l2 m2 s2">
                   <a href="mailto:xiaoyun@looseleafapp.com"><i className="fa fa-envelope fa-lg"></i></a>
                 </div>
              </div>
            </div>
          </li>
          <li><a href="https://drive.google.com/file/d/0B_uByl2mOTJIVTM3ZWRYRVpIcWs/view">Resume</a></li>
          <li><a href="http://xiaoyunyang.github.io/#work">Work</a></li>
          <li><a href="http://xiaoyunyang.github.io/#writing">Writing</a></li>
          <li><a href="http://xiaoyunyang.github.io/consulting/global-dev-corp/feedback-for-website.html">Consulting</a></li>
          <li><div className="divider"></div></li>
          <li><a className="subheader">Apps</a></li>
          <li><a className="waves-effect" href="./100days.html">100 Days Calculator</a></li>
          <li><a className="waves-effect" href="./url-builder.html">URL Builder</a></li>
          <li><a className="waves-effect" href="./avail-viewer.html">Avail Viewer</a></li>
          <li><a className="waves-effect" href="./query-builder.html">Query Builder</a></li>
       </ul>
     </div>)

  }
});
ReactDOM.render(<TopNav/>, document.getElementById('nav'));
