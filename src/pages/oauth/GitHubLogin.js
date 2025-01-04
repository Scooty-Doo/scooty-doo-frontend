import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GitHubLogin = ({setToken}) => {
    const navigate = useNavigate();

    const cleanUrl = () => {
        const [hashPath, queryString] = window.location.hash.split("?");
        const params = new URLSearchParams(queryString);

        // Ta bort 'code'-parametern
        //       params.delete("code");
        console.log(hashPath)
        // Återskapa hash utan 'code'
        const cleanHash = params.toString()
            ? `${hashPath}?${params.toString()}`
            : hashPath;

        // Uppdatera URL utan att ladda om sidan
        window.history.replaceState(null, "/homeclient", `${window.location.pathname}#${cleanHash}`);
    }

    useEffect(() => {
        // Maybe move to fetch model, if you use one.
        async function fetchLogin(code) {
            const backendURL = "http://localhost:8000/"
            try {
                let res = await fetch(backendURL + "v1/oauth/github", {
                    method: "POST",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({'code': code})
                });
                res = await res.json();
                setToken(res.token);
                sessionStorage.setItem("token", res.token);
                navigate("/homeclient", { replace: true});
                window.history.replaceState(null, "", `${window.location.pathname}#/homeclient`);
                return
            }
            catch (e) {
                console.log(e)
                navigate("/")
                return
            }
        }
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
    
        if (code) {
            fetchLogin(code);
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
