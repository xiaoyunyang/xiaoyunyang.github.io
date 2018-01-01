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
    return (
      <div>
        <div className="col s12 m12 l12">
          <p><i className="fa fa-link"></i>
            <a href="https://drive.google.com/file/d/0B_uByl2mOTJIVTM3ZWRYRVpIcWs/view?usp=sharing">  Most Current Resume</a>
          </p>
        </div>
        <div className="col s12 m12 l12">
          <iframe src="/assets/data/profile/resume.pdf"></iframe>
        </div>
      </div>
    );
  }
});
