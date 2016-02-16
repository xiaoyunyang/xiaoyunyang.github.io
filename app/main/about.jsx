var About = React.createClass({

  componentDidMount: function() {
    $('.materialboxed').materialbox();
    $('.slider').slider({full_width: true});
  },
  render: function() {
    return (
      <div>
        <div className="col s12 m8 l12">
          <h5>About me</h5>
          <p>
              Xiaoyun studied Electrical and Computer Engineering (ECE) at Carnegie Mellon University, 
              with a focus in distributed systems, machine learning, and signal processing. After getting her M.S. 
              in ECE, Xiaoyun has been working at Naval Reactors at Washington, DC, providing design and operational oversight for the 
              Navys submarines and aircraft careers. In her free time, Xiaoyun likes to travel and read. She is the founder 
              of <a href="looseleaf.us">LooseLeaf</a> and the author of <a href="#writing">Bad English Diary</a>. Checkout 
              her <a href="#cost">Data Visualization projects</a> and <a href="#writing">Writings</a>.
          </p>
        </div>
      </div>
    );
  }
});
ReactDOM.render(<About/>, document.getElementById('about'));