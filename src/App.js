import React from 'react'
import axios from 'axios'
import parseJsonData from './parseJsonData'
import { prepareToCanvasData } from './processData'
import './App.css'
import { drawContributions } from 'twitter-contributions-canvas'

class App extends React.Component {
  availableThemes = {
    standard: 'GitHub',
    halloween: 'Halloween',
    teal: 'Teal',
    leftPad: '@left_pad',
    dracula: 'Dracula',
    blue: 'Blue',
    panda: 'Panda 🐼',
    sunny: 'Sunny',
  }

  state = {
    username: '',
    rawData: null,
    parsedData: null,
    error: null,
    theme: 'standard',
  }

  canvas = React.createRef()

  handleUsernameChange = (e) => {
    this.setState({
      username: e.target.value,
    })
  }

  handleThemeChange = (e) => {
    this.setState({
      theme: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    e.persist()
    if (!this.state.username) {
      this.setState({ error: 'No username found' })
      return
    }
    axios
      .get(
        `https://cwyurr5wr7.execute-api.us-east-1.amazonaws.com/test/calltwitter?username=${this.state.username}`
      )
      .then((res) => {
        console.log(res.data)
        this.setState(
          { error: null, rawData: res.data, parsedData: null },
          () => {
            setTimeout(() => {
              parseJsonData(this.state.rawData, (newData) => {
                this.setState({ parsedData: newData }, () => this.drawCanvas())
              })
            }, 300)
          }
        )
      })
      .catch((error) => {
        console.log(error)
      })
  }

  drawCanvas() {
    if (this.state.parsedData) {
      // console.log(this.state.parsedData)
      const canvasData = prepareToCanvasData(this.state.parsedData)
      drawContributions(this.canvas.current, {
        data: canvasData,
        username: this.state.username,
        themeName: this.state.theme,
        footerText: 'Made with ❤️, originally by @sallar for github',
      })
    } else {
      this.setState({ error: 'Data is not parsed' })
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className='container'>
          <h3>Twitter Contribution Graph</h3>
          <form className='form' onSubmit={this.handleSubmit}>
            <div className='form-control'>
              <label htmlFor='username'>Username : </label>
              <input
                type='text'
                placeholder='Your Twitter Username'
                value={this.state.username}
                onChange={this.handleUsernameChange}
              />
            </div>
            <div className='form-control'>
              <label htmlFor='theme'>Theme : </label>
              <select
                // placeholder='Your Twitter Username'
                value={this.state.theme}
                onChange={this.handleThemeChange}
              >
                {Object.keys(this.availableThemes).map((theme) => (
                  <option key={theme} value={theme}>
                    {this.availableThemes[theme]}
                  </option>
                ))}
              </select>
            </div>
            <button type='submit'>Submit </button>
          </form>
          {this.state.error && <div className='error'>{this.state.error}</div>}
        </div>
        <div className='imageCenter'>
          <canvas ref={this.canvas} />
        </div>
      </React.Fragment>
    )
  }
}

export default App
