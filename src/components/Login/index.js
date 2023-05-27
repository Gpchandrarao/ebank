import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    UserId: '',
    pin: '',
    showError: false,
    errorMsg: '',
  }

  onSubmitFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {UserId, pin} = this.state
    const userDetails = {user_id: UserId, pin}

    const url = ' https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  renderPin = () => {
    const {pin} = this.state

    return (
      <>
        <label className="label-element" htmlFor="pin">
          PIN
        </label>
        <input
          className="input-element"
          value={pin}
          id="pin"
          type="password"
          onChange={this.onChangePin}
          placeholder="Enter PIN"
        />
      </>
    )
  }

  OnChangeUserId = event => {
    this.setState({UserId: event.target.value})
  }

  renderLoginForm = () => {
    const {UserId} = this.state
    return (
      <>
        <label className="label-element" htmlFor="userId">
          User Id
        </label>
        <input
          className="input-element"
          id="userId"
          type="text"
          value={UserId}
          onChange={this.OnChangeUserId}
          placeholder="Enter User ID"
        />
      </>
    )
  }

  render() {
    const {showError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="container">
        <div className="login-container">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="bank-logo"
            />
          </div>
          <div className="form-container">
            <form className="form" onSubmit={this.onSubmitForm}>
              <h1 className="form-heading">Welcome Back</h1>
              {this.renderLoginForm()}
              {this.renderPin()}
              <button className="sub-button" type="submit">
                Login
              </button>
              {showError ? <p className="error-msg">{errorMsg}</p> : null}
            </form>
          </div>
        </div>
      </div>
    )
  }
}
export default Login
