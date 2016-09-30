var Resume = React.createClass({

  componentDidMount: function() {
    $('video').each(function(){
      if ($(this).is(":in-viewport")) {
          $(this)[0].play();
      } else {
          $(this)[0].pause();
      }
    });
  },
  render: function() {
    console.log("resume!")
    return (
      <div>
        <div className="col s12 m8 l12">
          <iframe src="/assets/data/profile/resume.pdf"></iframe>
        </div>
      </div>
    );
  }
});
