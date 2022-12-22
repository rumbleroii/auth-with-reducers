import React from 'react'
import {} from './Login.css';

const database = {
    username:"Rithik",
    password:"test123"
}

const authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN_INIT': 
            state.username = action.payload.username;
            state.password = action.payload.password;
            return {
                ...state,
                isLoggedIn:false,
                isError:false,
                sessionInfo: false,
                authData: {...state}
            }
        case 'LOGIN': 
            return {
                ...state,
                isLoggedIn: true,
                isError:false,
                sessionInfo: false,
                authData: {...state}
            }

        case 'LOGOUT': 
            return {
                ...state,
                isLoggedIn: false,
                isError: false,
                sessionInfo: false,
                authData: {}
            }

        case 'LOGIN_FAILURE': 
            return {
                ...state,
                isLoggedIn: false,
                isError: true,
                sessionInfo: false,
            }
        case 'SET_SESSION':
            state.username = action.payload
            return {
                ...state,
                isLoggedIn: true,
                isError: false,
                sessionInfo: true,
                authData: {...state}
            }
        default:
            throw new Error();
    }
}

const Login = () => {
    // Setting session
    React.useEffect(() => {
        if(localStorage.getItem('session_info') !== null){
            dispatchAuth({
                type:"SET_SESSION",
                payload: localStorage.getItem('session_info')
            })
        }
    }, [])

    const [authenticate, dispatchAuth] = React.useReducer(
        authReducer,
        {authData: {}, isLoggedIn: false, isError: false, sessionInfo: false}
    );

    const LoginHandler = (e) => {
        e.preventDefault();

        if(authenticate.authData.username === database.username && authenticate.authData.password === database.password) {
            // Setting the session
            localStorage.setItem('session_info', authenticate.authData.username);
            dispatchAuth({
                type:'LOGIN',
            })
        } else {
            dispatchAuth({ type: 'LOGIN_FAILURE' })
        }
    }

    const LogoutHandler = () => {
        dispatchAuth({
            type:'LOGOUT',
        })
    }

    const UsernameHandler = (e) => {
        dispatchAuth({
            type:"LOGIN_INIT",
            payload: {...authenticate, username: e.target.value}
        })
    }

    const PasswordHandler = (e) => {
        dispatchAuth({
            type:"LOGIN_INIT",
            payload: {...authenticate, password: e.target.value}
        })
    }

  return (
    <div className='container'>
        <h1 className='header'>Welcome To IG Forum</h1>
        <Display authDetails={authenticate}/>
        <div className='loginCard'>
            <LoginButton loginHandle={LoginHandler} authDetails={authenticate} usernameHandle={UsernameHandler} passwordHandle={PasswordHandler}/>
            <LogoutButton logoutHandle={LogoutHandler} authDetails={authenticate}/>
        </div>
    </div>
  )
}

const Display = ({ authDetails }) => {
    return (
        <div className='container-logout'>
            {authDetails.sessionInfo && <p>Welcome Back!</p>}
            {authDetails.isError && <p>Incorrect Credentials</p>}
            {authDetails.isLoggedIn ? (
                 <p style={{ textAlign:'center', color:'green'}}>User, {authDetails.authData.username} is Logged In</p>
            ) : (
                <p style={{ textAlign:'center', color:'red'}}>User Not Logged In, Yet</p>
            )}
        </div>
    )
}

const LoginButton = ({ loginHandle, authDetails, usernameHandle, passwordHandle }) => {
    return (
        <div>
            {!authDetails.isLoggedIn && (
                <div className='container-login'>
                    <h2 style={{ textAlign: 'center' }}>Login</h2>
                    <form className='loginForm' onSubmit={loginHandle}>
                        <label htmlFor='username'>Username: </label>
                        <input type='text' id='username' name='username' onChange={usernameHandle}/>
                        <label htmlFor='username'>Password: </label>
                        <input type='password' id='password' name='password' onChange={passwordHandle}/>
                        <input style={{ color : 'green' }}type='submit' name='login'/>
                    </form>
                </div>
            )}
        </div>
    )
}

const LogoutButton = ({ logoutHandle, authDetails }) => {
    return (
        <div className='container-logout'>
            {   
                authDetails.isLoggedIn 
                && 
                <button className='logoutButton' onClick={logoutHandle}>Logout</button>
            }
        </div>  
    )
}

export default Login;