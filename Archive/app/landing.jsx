var Nav = React.createClass({
  componentDidMount: function(){
    $(".button-collapse").sideNav({
      edge: 'left',
      closeOnClick: true
    });

    $('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 100, // Transition in duration
      out_duration: 150, // Transition out duration
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
                <li><a href="http://eepurl.com/cgdpfP">Build A Notebook</a></li>
                <li><a href="/dashboard.html">Explore Notebooks <i className="fa fa-angle-down" aria-hidden="true"></i></a></li>
                <li><a href="/about.html">Mission</a></li>
                <li><a id="signup-btn" href="http://eepurl.com/cgdpfP" className="waves-effect waves-light btn modal-trigger">Sign up</a></li>
              </ul>
              <a href="#" data-activates="mobile-menu" className="button-collapse left"><i className="mdi-navigation-menu"></i></a>
              <ul className="side-nav" id="mobile-menu">
                <li><a href="http://looseleafapp.com/dashboard.html">Browse Notebooks</a></li>
                <li><a href="http://looseleafapp.com/about.html">Mission</a></li>
                <li><a href="#signup-modal" className="modal-trigger">Sign up</a></li>
              </ul>
            </div>
          </nav>
        </div>
        <div id="signup-modal" className="modal">
          <SocialLogin action="Join" header="Join a community of lifelong learners for free!"/>
          <div className="row center hero">
            Already a member? <a className="modal-trigger modal-action modal-close" href="#login-modal">Log in</a>
          </div>
        </div>
        <div id="login-modal" className="modal">
          <SocialLogin action="Continue" header="Log in to LooseLeaf"/>
          <div className="row center hero">
            New to LooseLeaf? <a className="modal-trigger modal-action modal-close" href="#signup-modal">Sign up</a>
          </div>
        </div>
      </div>
    );
  }
});

var LoginForm = React.createClass({
  renderForgotPass: function() {
    if(this.props.action == 'Continue') {
      return (
        <div className="row container">
          <div className="col s12 m12 l12">
            <a className="offset-l6" href="">Forgot password</a>
          </div>
        </div>
      );
    } else return (
      <a className="offset-l6" href=""></a>
    );
  },
  render: function() {
    return (
      <div className="col s12 m10 offset-m1 l10 offset-l1 center">
        <div className="row">
          <form className="col s12">
            <div className="input-field col s12 m6 l6">
              <input id="email" type="email" className="validate"/>
              <label for="email"><i className="fa fa-envelope"></i> Email</label>

            </div>
            <div className="input-field col s12 m6 l6">
              <input id="password" type="password" class="validate"/>
              <label for="password"><i className="fa fa-lock"></i> Password</label>
              { this.renderForgotPass() }
            </div>
          </form>
        </div>
        <a className="waves-effect waves-light btn modal-trigger" href="#singup-modal">
          {this.props.action} with Email
        </a>
      </div>
    );
  }
})

var SocialLogin = React.createClass({
  render: function() {
    return (
      <div className="modal-content">
        <div className="row container center">
          <h5 className="text-brown">{this.props.header}</h5>
        </div>
        <div className="row center">
          <div className="col s12 m10 offset-m1 l8 offset-l2 social-logins">
            <div className="btn-facebook">
              <a className="waves-effect waves-light btn modal-trigger" href="#singup-modal">
                <i className="fa fa-facebook fa-lg"></i>
                {this.props.action}  with Facebook
              </a>
            </div>
          </div>
          <div className="col s12 m10 offset-m1 l8 offset-l2 social-logins">
            <div className="btn-twitter">
              <a className="waves-effect waves-light btn modal-trigger" href="#singup-modal">
                <i className="fa fa-twitter fa-lg"></i>
                {this.props.action}  with Twitter
              </a>
            </div>
          </div>
          <div className="col s12 m10 offset-m1 l8 offset-l2 social-logins">
            <div className="btn-google">
              <a className="waves-effect waves-light btn modal-trigger" href="#singup-modal">
                <i className="fa fa-google fa-lg"></i>
                {this.props.action} with Google
              </a>
            </div>
          </div>
        </div>
        <div className="row or-divider">
          <span>OR</span>
        </div>
        <LoginForm action={this.props.action}/>
      </div>
    );
  }
})
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
              &copy; 2016 LooseLeaf LLC. Made with <i className="fa fa-heart fa-lg"></i> in DC.
            </p>
          </div>
        </div>
      </footer>

    );
  }
});
ReactDOM.render(<Footer/>, document.getElementById('landing-footer'));
ReactDOM.render(<Nav/>, document.getElementById('navbar'));
