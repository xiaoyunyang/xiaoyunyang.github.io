var Footer = React.createClass({
  render: function() {
    return (
      <footer className="page-footer blue-grey lighten-5">
        <div className="container">
          <div className="row">
            <div className="col l8 s12">
              <p className="blue-grey-text text-lighten-1">Made with
                <a target="_blank" href="https://reactjs.org/"><i class="fab fa-react"></i> React.js</a> and
                <a target="_blank" href="http://materializecss.com/">
                  {' MaterializeCSS '}
                </a>with <i className="fas fa-heart"></i> by <a href="http://xiaoyunyang.github.io/">Xiaoyun Yang</a>.
              </p>
              <p className="blue-grey-text text-lighten-1">
                View source code
                <a href="https://github.com/xiaoyunyang/serverless-webapp-no-internet">
                  {' here'}
                </a>
              </p>
            </div>
            <div className="footer-copyright blue-grey lighten-5"></div>
          </div>
        </div>
      </footer>

    );
  }
});
ReactDOM.render(<Footer/>, document.getElementById('footer'));
