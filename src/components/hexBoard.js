import React, { Component } from 'react'
//import {connect} from 'react-redux'

class hexBoard extends Component {

  render() {
    return (
        <div id="hexCluster">
          <div>
            <div className="hex">&#x2B22;</div>
          </div>
          <div>
            <div className="hex">&#x2B22;</div>
            <div className="hex">&#x2B22;</div>
          </div>
          <div>
            <div className="hex">&#x2B22;</div>
            <div className="hex">&#x2B22;</div>
            <div className="hex">&#x2B22;</div>
          </div>
          <div>
            <div className="hex">&#x2B22;</div>
            <div className="hex">&#x2B22;</div>
            <div className="hex">&#x2B22;</div>
            <div className="hex">&#x2B22;</div>
          </div>
          <div>
            <div className="hex">&#x2B22;</div>
            <div className="hex">&#x2B22;</div>
            <div className="hex">&#x2B22;</div>
          </div>
          <div>
            <div className="hex">&#x2B22;</div>
            <div className="hex">&#x2B22;</div>

          </div>
          <div>
            <div className="hex">&#x2B22;</div>

          </div>
        </div>
      );
    }
  }

  export default hexBoard;