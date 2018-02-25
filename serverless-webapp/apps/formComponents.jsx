var InputDropdown = React.createClass({
  componentDidMount: function() {
    $('#'+this.props.id).material_select(
      this.handleClick.bind(this)
    );
  },
  handleClick: function() {
    var newData = $('#'+this.props.id).val();
    this.props.setState(newData)
  },
  renderUnits: function(data, units) {
    if(!units) return '';

    if (typeof(data) === 'number') {
      return data > 1 ? units + 's' : units;
    }
    return units;
  },
  render: function() {
    return (
      <div className='input-field col l6 m6 s12'>
        <select id={this.props.id}>
          <option value='None' disabled selected>{this.props.label}</option>
          {
            this.props.choices.map(function(d,i) {
              return (
                <option value={d}>
                  {d + ' ' + this.renderUnits(d, this.props.units)}
                </option>);
            }.bind(this))
          }
        </select>
        <label>{this.props.label}</label>
      </div>
    );
  },
});
var InputTags = React.createClass({
  componentDidMount: function() {
    var tags = this.props.selectedTags.map(function(d) {
      return {tag: d};
    });
    var options = this.props.tags.map(function(d) {
      var tmp = {};
      tmp[d] = null;
      return tmp;
    }).reduce(function(acc, x) {
      for (var key in x) acc[key] = x[key];
      return acc;
    }, {});

    $('#'+this.props.id).material_chip({
      data: tags,
      placeholder: this.props.label,
      secondaryPlaceholder: this.props.hint,
      autocompleteOptions: {
        data: options,
        limit: Infinity,
        minLength: 1
      }
    });
    $('#'+this.props.id).on('chip.add', function(e, chip){
      this.handleAddTag(chip.tag);
    }.bind(this));
    $('#'+this.props.id).on('chip.delete', function(e, chip){
      this.handleDeleteTag(chip.tag);
    }.bind(this));
  },
  handleAddTag: function(tag) {
    var selectedNew = this.props.selectedTags.concat(tag);
    this.props.setState(selectedNew);
  },
  handleDeleteTag: function(tag) {
    var selectedNew = this.props.selectedTags.filter(function(d){
      return d !== tag;
    });
    this.props.setState(selectedNew);
  },
  render: function() {
    return (
      <div className="col l12 m12 s12">
        <label>{this.props.label}</label>
        <div className="chips" id={this.props.id}></div>
      </div>
    );
  }
});
