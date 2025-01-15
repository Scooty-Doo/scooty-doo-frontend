import React from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLogin } from '../../api/oauthApi';

const GitHubLogin = ({setToken}) => {
    const navigate = useNavigate();

    useEffect(() => {
        const login = async (code, role="user") => {
            try {
                let res = await fetchLogin(code, role);
                console.log("Response from fetchLogin:", res);

                console.log("Token:", res.access_token);
        
                sessionStorage.setItem("token", res.access_token); // Please make this work ;)
                setToken(res.access_token)

        
                if (role === "admin")
                {
                    navigate("/home", { replace: true});
                    window.history.replaceState(null, "", `${window.location.pathname}#/home`);
                    return
                }
                navigate("/homeclient", { replace: true});
                window.history.replaceState(null, "", `${window.location.pathname}#/homeclient`);
            } catch (e) {
                console.log(e)
                window.history.replaceState(null, "", `${window.location.pathname}`);
                navigate("/")
            }
            
        }
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            login(code, sessionStorage.getItem("role"));
            return
        }
        navigate("/")
        window.history.replaceState(null, "", `${window.location.pathname}`);
        return
    }, [navigate, setToken]);
    // This needs some styling
    return <div>Processing GitHub login...</div>;
}

GitHubLogin.propTypes = {
    setToken: PropTypes.func.isRequired,
};

export default GitHubLogin
