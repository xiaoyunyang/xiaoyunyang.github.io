var Nav = React.createClass({
  componentDidMount: function(){
    $(".button-collapse").sideNav({
      edge: 'left',
      closeOnClick: true
    });

    $('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
      starting_top: '4%', // Starting top style attribute
      ending_top: '10%', // Ending top style attribute
      //ready: function() { alert('Ready'); }, // Callback for Modal open
      //complete: function() { alert('Closed'); } // Callback for Modal close
    });
  },
  render: function() {
    return (
      <div>
        <div className="navbar-fixed">
          <nav className="grey lighten-4">
            <div className=" nav-wrapper-white nav-text-links">
              <div className="brand-logo">
                <a className="navbar-brand" href="/">
                  <img src="/assets/images/logo/logo.png" alt="LooseLeaf"/>
                </a>
              </div>
              <ul className="right hide-on-med-and-down">
                <li><a href="/">Build A Notebook</a></li>
                <li><a href="/dashboard.html">Explore Notebooks <i className="fa fa-angle-down" aria-hidden="true"></i></a></li>
                <li><a href="/about.html">Mission</a></li>
                <li><a className="text-green modal-trigger" href="#login-modal">Log in</a></li>
                <li><a id="signup-btn" href="#singup-modal" className="waves-effect waves-light btn modal-trigger">Sign up</a></li>
              </ul>
              <a href="#" data-activates="mobile-menu" className="button-collapse left"><i className="mdi-navigation-menu"></i></a>
              <ul className="side-nav" id="mobile-menu">
                <li><a href="http://looseleafapp.com/dashboard.html">Browse Notebooks</a></li>
                <li><a href="http://looseleafapp.com/about.html">Mission</a></li>
                <li><a href="#singup-modal" className="modal-trigger">Sign up</a></li>
              </ul>
            </div>
          </nav>
        </div>
        <div id="singup-modal" className="modal">
          <div className="modal-content">
            <div className="row container center">
              <h5 className="text-brown">Join a community of lifelong learners for free.</h5>
            </div>
            <div className="row center">
              <div className="col s12 m10 offset-m1 l8 offset-l2 social-logins">
                <div className="btn-facebook">
                  <a className="waves-effect waves-light btn modal-trigger" href="#singup-modal">
                    <i className="fa fa-facebook fa-lg"></i>
                    Join with Facebook
                  </a>
                </div>
              </div>
              <div className="col s12 m10 offset-m1 l8 offset-l2 social-logins">
                <div className="btn-twitter">
                  <a className="waves-effect waves-light btn modal-trigger" href="#singup-modal">
                    <i className="fa fa-twitter fa-lg"></i>
                    Join with Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="login-modal" className="modal">
          <div className="modal-content">
            <div className="row container center">
              <h5 className="text-brown">Login to LooseLeaf</h5>
            </div>
            <div className="row center">
              <div className="col s12 m10 offset-m1 l8 offset-l2 social-logins">
                <div className="btn-facebook">
                  <a className="waves-effect waves-light btn modal-trigger" href="#singup-modal">
                    <i className="fa fa-facebook fa-lg"></i>
                    Continue with Facebook
                  </a>
                </div>
              </div>
              <div className="col s12 m10 offset-m1 l8 offset-l2 social-logins">
                <div className="btn-twitter">
                  <a className="waves-effect waves-light btn modal-trigger" href="#singup-modal">
                    <i className="fa fa-twitter fa-lg"></i>
                    Continue with Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});


var Footer = React.createClass({
  componentDidMount: function(){
    $('.tooltipped').tooltip({delay: 50});
  },
  render: function() {
    return (
      <footer className="page-footer section-green">
        <div className="container">
          <div className="row">
            <div className="col l6 m12 s12">
              <div className="col l6 m4 s6">
                <a href="/">
                  <img src="/assets/images/logo/beta.png"/>
                </a>
              </div>
              <div className="col l12 s12">
                <p className="light footer-text-links">Start using LooseLeaf to maximize your online learning today. It is s completely free and we
                will work with you one-on-one to get you started and answer any questions.</p>
              </div>
            </div>
            <div className="col l6 m12 s12">
              <div className="col s4 offset-s1">
                <h5 className="white-text"><strong>Notebooks</strong></h5>
                <h6>
                  <ul className="light footer-text-links">
                    <li><a href="#!">Entrepreneurs</a></li>
                    <li><a href="#!">Teachers</a></li>
                    <li><a href="#!">Designers</a></li>
                    <li><a href="#!">Developers</a></li>
                    <li><a href="#!">Freelancers</a></li>
                    <li><a href="#!">Your own</a></li>
                  </ul>
                </h6>
              </div>
              <div className="col s4 offset-s1">
                <h5 className="white-text"><strong>Company</strong></h5>
                <h6>
                  <ul className="light footer-text-links">
                    <li><a href="about.html">Our Mission</a></li>
                  </ul>
                </h6>
                <div className="social-icons">
                  <a target="_blank" href="https://www.facebook.com/mylooseleaf">
                    <i className="fa fa-facebook fa-lg"></i>
                  </a>
                  <a target="_blank" href="https://twitter.com/mylooseleaf">
                    <i className="fa fa-twitter fa-lg"></i>
                  </a>
                  <a className="tooltipped" data-position="top" data-delay="50" data-tooltip="Email us" href="mailto:info@looseleaf.us">
                    <i className="fa fa-envelope fa-lg"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            <p>
              &copy; 2016 LooseLeaf. Made with <i className="fa fa-heart fa-lg"></i> in DC.
            </p>
          </div>
        </div>
      </footer>

    );
  }
});
ReactDOM.render(<Footer/>, document.getElementById('landing-footer'));
ReactDOM.render(<Nav/>, document.getElementById('navbar'));
