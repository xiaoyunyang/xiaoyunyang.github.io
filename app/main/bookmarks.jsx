var BookmarksList = React.createClass({
  componentWillMount: function() {
    this.setState({items: this.props.data});
  },
  getInitialState: function() {
    return {
      items: []
    };
  },
  render: function() {
    return (
      <div>
        <div className="col s12 m8 l8">
          <div className="row">
            <div className="col s8"><h5>{this.props.username+"'s Notebook"}</h5></div>
            <div className="col s4">
              <a className="waves-effect waves-light btn h4-aligned-btn" href="#matrix">Visualize me!</a>
            </div>
          </div>
        <List items={this.state.items}/>
        </div>
        <div className="col s12 m8 l4">
          <h5>Notebooks</h5>
          <ul className="collection">
            <li className="collection-item avatar">
              <img className="square" src="../assets/data/profile/photo/looseleaf.png" />
              <span className="title"><a href="dashboard.html">LooseLeaf</a></span>
              <p>A new delivery vehicle for educational content online</p>
              <a target="_blank" href="https://docs.google.com/spreadsheets/d/1dY9xXzn4AtzvlhlhMO24xhe53KWr5pnNKVckM3YboKE/edit?usp=sharing" className="secondary-content"><i className="material-icons">&#xE254;</i></a>
            </li>
            <li className="collection-item avatar">
              <img className="square" src="../assets/data/profile/photo/xyang.png" />
              <span className="title"><a href="user-xyang.html">Xiaoyun Yang</a></span>
              <p>Entrepreneur, engineer, founder of LooseLeaf</p>
              <a target="_blank" href="https://docs.google.com/spreadsheets/d/1K7Wxt2Ma6ksU8LOSvksJioPcApZISssxU5ceOx7CENQ/edit?usp=sharing" className="secondary-content"><i className="material-icons">&#xE254;</i></a>
            </li>
            <li className="collection-item avatar">
              <img className="square" src="../assets/data/profile/photo/afenner.png" />
              <span className="title"><a href="user-afenner.html">Andrew Fenner</a></span>
              <p>Entrepreneur, math teacher, founder of NumberShapes</p>
              <a target="_blank" href="https://docs.google.com/spreadsheets/d/1-GDFZYik7_FQIJ4GTTDcOYbl8590BNs-pvDOcApQSI4/edit?usp=sharing" className="secondary-content"><i className="material-icons">&#xE254;</i></a>
            </li>
            <li className="collection-item avatar">
              <img className="square" src="../assets/data/profile/photo/numbershapes.png" />
              <span className="title"><a href="user-numbershapes.html">NumberShapes</a></span>
              <p>The best digital manipulative apps with which to teach early math on the app store.</p>
              <a target="_blank" href="https://docs.google.com/spreadsheets/d/1B-8MiNx8WyPAHEIZT3hOgmpcY_B6vECrOxHaQY9nFRw/edit?usp=sharing" className="secondary-content"><i className="material-icons">&#xE254;</i></a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
