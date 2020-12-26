const exec = require('child_process').exec;
const { dialog } = require('electron').remote
import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * logg
 * @memberof $shared
 */
const logg = (a, b="", c=null) => {
  b = `${b}`;
  c = "string" === typeof c ? c : b.replace(/\W/g, "");
  if (c.length > 0) { window[c] = a; }
  console.log(`+++ ${b}:`, a);
};


export default class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
  };

  state = {
    username: '',
    stdout: '',
    stderr: '',
    error: '',
  };

  handleTest = () => {
    this.setState({ stdout: '', stderr: '', error: '' })
    exec('echo process.resourcesPath', (error, stdout, stderr) => {
      this.setState({ stdout, stderr, error, })
    })
  };

  handleCreateThumbs = (e) => {
    this.setState({ stdout: '', stderr: '', error: '' })
    const path = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
    if (path) {
      exec(`${process.resourcesPath}/app/scripts/generate_thumbs "${path}" "${process.resourcesPath}"`, (error, stdout, stderr) => {
        this.setState({ stdout, stderr, error, })
      })
    }
  }

  handleConvertVideo = (e) => {
    this.setState({ stdout: '', stderr: '', error: '' })
    const path = dialog.showOpenDialogSync({ properties: ['openFile'] })
    if (path) {
      exec(`${process.resourcesPath}/scripts/convert_video "${path}"`, (error, stdout, stderr) => {
        this.setState({ stdout, stderr, error, })
      })
    }
  }

  handleRemoveFilenameSpaces = (e) => {
    this.setState({ stdout: '', stderr: '', error: '' })
    const path = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
    if (path) {
      exec(`${process.resourcesPath}/scripts/remove_filename_spaces "${path}"`, (error, stdout, stderr) => {
        this.setState({ stdout, stderr, error, })
      })
    }
  }

  render() {
    return (
      <div>

        <button onClick={this.handleTest}>Test</button>
        <button onClick={this.handleCreateThumbs}>Create Thumbs</button>
        <button onClick={this.handleRemoveFilenameSpaces}>remove filename spaces</button>
        <button onClick={this.handleConvertVideo}>convert video</button>

        <div>
          <h5>error</h5>
          <pre>{this.state.error}</pre>
        </div>
        <div>
          <h5>stdout</h5>
          <pre>{this.state.stdout}</pre>
        </div>
        <div>
          <h5>stderr</h5>
          <pre>{this.state.stderr}</pre>
        </div>

      </div>
    )
  }
}
