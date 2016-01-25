// GoogleMap React component

var GoogleMap = React.createClass({

  componentDidMount() {
    this.customOverlayMap = {};
    this.map = new google.maps.Map(this.getDOMNode(), this.props.mapOptions);
    this.drawCustomOverlays(this.props.children);
  },

  componentWillReceiveProps(nextProps) {
    this.redrawCustomOverlays(nextProps.children);
  },

  drawCustomOverlays(children) {
    React.Children.forEach(children, child => {
      this.customOverlayMap[child.props.id] = new GoogleCustomOverlay(this.map, child) // GoogleCustomOverlay is a subclass of google.maps.OverlayView. 
    });
  },
 
  redrawCustomOverlays(children) {
    // logic to update the overlays on the map. Involves adding custom methods to your implementation of google.maps.OverlayView, and calling React.render() on the child overlay component to re-render.
    React.Children.forEach(children, child => {
      var existingOverlay = this.customOverlayMap(child.props.id);
      if (existingOverlay) {
        existingOverlay.updateChildComponent(child);
        existingOverlay.renderReactComponent();
      }
   });
  },

  render() {
    // it simply renders an empty div, so the Google Maps API can mount a map on it.
    return <div></div>
 },
});


// CustomOverlay React component 

var CustomOverlay = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired,
  },

  render() {
  // returns a <div> representing a small pin
  },
});


// Outline of GoogleCustomOverlay, a subclass of google.maps.OverlayView - for more background on this, please take a look at the documentation

var GoogleCustomOverlay = function(map, reactComponent) {
  this.id = reactComponent.id;
  this.lat = reactComponent.lat;
  this.lng = reactComponent.lng;
  this.reactComponent = reactComponent;
  this.setMap(map);
this.containerElement = document.createElement(‘div’)
};

GoogleCustomOverlay.prototype.onAdd = function() {
  // projection and lat/lng getting is done first, not shown.
  this.renderReactComponent(); // important to call this.render, so the React component is rendered.
}

// Custom functions to be called when pin should be redrawn

GoogleCustomOverlay.prototype.updateReactComponent = function(newReactComponent) {
  this.reactComponent = newReactComponent;
};

GoogleCustomOverlay.prototype.renderReactComponent = function() {
  React.render(this.reactComponent, this.containerElement);
};

