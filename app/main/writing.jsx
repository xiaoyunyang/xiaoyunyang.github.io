var Writing = React.createClass({
  componentDidMount: function() {
    $('.materialboxed').materialbox();
  },
  render: function() {
    return (
      <div>
        <div className="col s12 m8 l8">
          <MdText url="assets/md/BED.md" textId="text-writing" />
          <div className="col s12 m8 l4">

            <ul className="collapsible popout" data-collapsible="accordion">
              <li>
                <div className="collapsible-header"><i className="material-icons">filter_drama</i>10/28/2012</div>
                <div className="collapsible-body">
                  <img className="materialboxed" data-caption="My First diary entry when I spoke bad english" width="250" src="assets/img/badEnglishDiary/2002-10-29.JPG" />
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="col s12 m8 l4">
          <h5>Other Writings</h5>

          <ul className="collection with-header ll-listing">
            <li className="collection-item">
              <a target="_blank" href="https://medium.com/@xiaoyunyang/10-best-things-i-did-before-i-turned-25-5511d23b726d#.4aax6w78m">
                10 Best Things I did before I turned 25.
              </a>
              <p>
                 An article I wrote for Medium (published 2/24/16), in which I reflect on all the things I accomplished before the age of 25.
              </p>
            </li>
          </ul>

        </div>

      </div>
    );
  }
});
