import React from 'react';

class ColorSquare extends React.PureComponent {
  render() {
    const CustomIcon = this.props.customIcon;
    return (
      <CustomIcon
        style={{color: this.props.color}}
      />
    );
  }
}

export default ColorSquare;
