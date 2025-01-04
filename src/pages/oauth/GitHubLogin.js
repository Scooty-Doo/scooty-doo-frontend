import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLogin } from '../../api/oauthApi';

const GitHubLogin = ({setToken}) => {
    const navigate = useNavigate();


    useEffect(() => {
        const login = async () => {
            try {
                let res = await fetchLogin(code);
                setToken(res.token);
                sessionStorage.setItem("token", res.token);
                navigate("/homeclient", { replace: true});
                window.history.replaceState(null, "", `${window.location.pathname}#/homeclient`);
            } catch (e) {
                console.log(e)
                navigate("/")
            }
            
        }
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            login(code);
            return
        }
        navigate("/")
        window.history.replaceState(null, "", `${window.location.pathname}#/homeclient`);
        return
    }, []);
    // This needs some styling
    return <div>Processing GitHub login...</div>;
}

export default GitHubLogin
