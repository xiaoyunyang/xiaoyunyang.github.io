var Footer = React.createClass({
  componentDidMount: function(){
    $('.tooltipped').tooltip({delay: 50});
  },
  render: function() {
    return (
        <footer className="page-footer dashboard-footer section-green">
          <div className="container">
            <div className="row">
            </div>
          </div>
          <div className="footer-copyright">
            <div className="container">
              Copyright 2016 Xiaoyun Yang
              <div className="social-icons right">
                <a className = "tooltipped" data-position="top" data-delay="50" data-tooltip="Where I curate things about entrepreneurship" href="https://www.facebook.com/looseleafUS/?fref=ts">
                  <i className="fa fa-facebook fa-lg"></i>
                </a>
                <a className = "tooltipped" data-position="top" data-delay="50" data-tooltip="My E-resume" href="https://www.linkedin.com/in/xiaoyun-yang-380a9874">
                  <i className="fa fa-linkedin fa-lg"></i>
                </a>
                <a className = "tooltipped" data-position="top" data-delay="50" data-tooltip="My open source projects" href="https://github.com/xiaoyunyang">
                  <i className = "fa fa-github fa-lg"></i>
                </a>
                <a className = "tooltipped" data-position="top" data-delay="50" data-tooltip="My company's Twitter Page" href="https://twitter.com/mylooseleaf">
                  <i className="fa fa-twitter fa-lg"></i>
                </a>
                <a className = "tooltipped" data-position="top" data-delay="50" data-tooltip="Email me" href="mailto:xyang232@gmail.com">
                  <i className = "fa fa-envelope fa-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </footer>
    );
  }
});
ReactDOM.render(<Footer/>, document.getElementById('footer'));
