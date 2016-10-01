var About = React.createClass({

  componentDidMount: function() {
    $('.materialboxed').materialbox();
    $('.slider').slider({full_width: true});
  },
  render: function() {
    return (
      <div>
        <div className="col s12 m12 l12">
          <MdText url={this.props.mdUrl} textId="text-about" />
          <div className="row">
            <h5>Xiaoyun&rsquo;s Book Recommendations:</h5>
            <BookCard
              bookCover="https://images-na.ssl-images-amazon.com/images/I/51H-BXIZTjL.jpg"
              bookName="Marketing"
              bookDesc="The bullseye method, A/B testing, and 19 traction channels including blogging, press, email marketing, and social media marketing, to help you acquire customers."
              bookLink="https://goo.gl/tR6LCg"
              />
            <BookCard
              bookCover="https://images-na.ssl-images-amazon.com/images/I/51l3jMA9XqL._SX324_BO1,204,203,200_.jpg"
              bookName="Life"
              bookDesc="This book gives you specific direction for body language, and things you need to say when engaging in smalltalk or sales in order to make a good impression on people."
              bookLink="https://goo.gl/OEUerx"
              />
            <BookCard
              bookCover="https://images-na.ssl-images-amazon.com/images/I/51ponYxAfKL._SX329_BO1,204,203,200_.jpg"
              bookName="Startup"
              bookDesc="A smartcut is a shortcut that lets you reach your goals faster by working smarter. Shane Snow introduces 9 smartcuts, most notably, mentorship, platforms, rapid feedback, superconnections, waves, and 10X thinking."
              bookLink="https://goo.gl/MFOpQQ"
              />
            <BookCard
              bookCover="https://images-na.ssl-images-amazon.com/images/I/513LYPt7xtL.jpg"
              bookName="Startup"
              bookDesc="A good walkthrough of the steps required to bootstrap a startup. This book gives a lot of good examples of how other entrepreneurs successfully bootstrapped startups."
              bookLink="https://goo.gl/yx5n8A"
              />
          </div>
          <div className="row">
            <BookCard
              bookCover="https://images-na.ssl-images-amazon.com/images/I/41puRJbtwkL._SX331_BO1,204,203,200_.jpg"
              bookName="Startup"
              bookDesc="What does it take to be a founder and succeed in Entrepreneurship. This book looks at economics, globalization, and founder characteristics and qualitites of good entrepreneurs."
              bookLink="https://goo.gl/m38o9I"
              />
            <BookCard
              bookCover="https://images-na.ssl-images-amazon.com/images/I/412CR0GjfKL._SX326_BO1,204,203,200_.jpg"
              bookName="Business"
              bookDesc="A black swan event is an abberation that has a major effect on our perception of established norms. The subject of this book has useful applications in investment and business."
              bookLink="https://goo.gl/42i1nC"
              />
            <BookCard bookCover="https://images-na.ssl-images-amazon.com/images/I/4193iI6WHqL._SY344_BO1,204,203,200_.jpg"
              bookName="AI"
              bookDesc="Learn about the isomorphisms between the paintings of Escher, the music of Bach, and the theorems of Godel (The self referencing, recursive patterns). Learn the meanings of meaning, recursion, and self."
              bookLink="https://goo.gl/jvSUzo"
              />
            <BookCard
              bookCover="https://images-na.ssl-images-amazon.com/images/I/41uy7WNaFgL._SX327_BO1,204,203,200_.jpg"
              bookName="Business"
              bookDesc="How to offer free service to users while still making money using several business models, e.g., the Freemium, Direct Gillette, Usage Charge (Evernote), Sponsorship, Open Source, and Zynga models."
              bookLink="https://goo.gl/6e81s3"
              />
          </div>
          <div className="row">
            <BookCard
              bookCover="https://images-na.ssl-images-amazon.com/images/I/51jDlKtbC-L._SY445_QL70_.jpg"
              bookName="Business"
              bookDesc="An interesting argument on how a large groups of people might be smarter than a small group of experts. Basis for crowdsourcing?"
              bookLink="https://goo.gl/XIJCYI"
              />
            <BookCard
              bookCover="https://images-na.ssl-images-amazon.com/images/I/51Q4AwpPDkL.jpg"
              bookName="Business"
              bookDesc="A look into what cause habits to form and break, and how the culture of the organization (group habit) can predict individual behavior. "
              bookLink="https://goo.gl/Fuypwo"
              />
          </div>
        </div>
      </div>
    );
  }
});

var BookCard = React.createClass({
  render: function() {
    return (
      <div className="col l3 m3">
    		<div className="card">
    		<div className="card-image waves-effect waves-block waves-light">
      			<img className="activator" src={this.props.bookCover} />
    		</div>
    		<div className="card-content">
      			<span className="card-title activator grey-text text-darken-4"><i className="material-icons right">more_vert</i></span>
      			<p><a target="_blank" href={this.props.bookLink}>Read</a></p>
    		</div>
    		<div className="card-reveal">
      		<span className="card-title grey-text text-darken-4">{this.props.bookName}<i className="material-icons right">close</i></span>
     			<p>{this.props.bookDesc}</p>
    		</div>
      	</div>
      </div>
    );
  }
});
