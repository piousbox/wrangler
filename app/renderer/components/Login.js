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
  };

  handleLogin = () => {
    this.props.onLogin({
      username: this.state.username,
      loggedIn: true,
    });
  };

  handleChange = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  handleCreateThumbs = (e) => {
    this.setState({ stdout: '' })

    const tmp = dialog.showOpenDialogSync({ properties: ['openDirectory'] })

    const execute = () => {
      exec(`./scripts/generate_thumbs "${tmp}"`, (error, stdout, stderr) => {
        logg(error, 'error')
        logg(stdout, 'stdout')
        logg(stderr, 'stderr')
        this.setState({ stdout, })
      })
    }

    execute()
  }

  handleConvertVideo = (e) => {
    this.setState({ stdout: '' })
    const path = dialog.showOpenDialogSync({ properties: ['openFile'] })
    logg(path, 'path')
    exec(`./scripts/convert_video "${path}"`, (error, stdout, stderr) => {
      logg(error, 'error')
      logg(stdout, 'stdout')
      logg(stderr, 'stderr')
      this.setState({ stdout, })
    })
  }

  handleRemoveFilenameSpaces = (e) => {
    const tmp = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
    logg(tmp, 'tmp')

    exec(`./scripts/remove_filename_spaces "${tmp}"`, (error, stdout, stderr) => {
      logg(error, 'error')
      logg(stdout, 'stdout')
      logg(stderr, 'stderr')
      this.setState({ stdout, })
    })
  }

  render() {
    return (
      <div>

        <h2>Select Dir</h2>
        <button onClick={this.handleCreateThumbs}>Create Thumbs</button>
        <button onClick={this.handleRemoveFilenameSpaces}>remove filename spaces</button>
        <button onClick={this.handleConvertVideo}>convert video</button>

        <div>
          <pre>{this.state.stdout}</pre>
        </div>

      </div>
    )
  }
}
