import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {userId: '', pin: '', errorMsg: '', view: false}

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  successView = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  failureView = errorMsg => {
    this.setState({view: true, errorMsg})
  }

  LoginPage = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.successView(data.jwt_token)
    } else {
      this.failureView(data.error_msg)
    }
  }

  render() {
    const {userId, pin, view, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="content-container">
          <div className="image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="login-img"
            />
          </div>
          <form className="form-container" onSubmit={this.LoginPage}>
            <h1 className="main-heading">Welcome Back!</h1>
            <div className="input-label-container">
              <label htmlFor="user-id" className="label-text">
                User ID
              </label>
              <input
                type="text"
                placeholder="Enter User ID"
                onChange={this.onChangeUserId}
                value={userId}
                id="user-id"
                className="input-text"
              />
            </div>
            <div className="input-label-container">
              <label htmlFor="pin" className="label-text">
                PIN
              </label>
              <input
                type="password"
                placeholder="Enter PIN"
                onChange={this.onChangePin}
                value={pin}
                id="pin"
                className="input-text"
              />
            </div>
            <button className="login-button" type="submit">
              Login
            </button>
            <div className="error">
              {view === true && <p className="error-msg">{errorMsg}</p>}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
