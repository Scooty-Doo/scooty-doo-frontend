const backendURL = "http://localhost:8000/"

export async function fetchLogin(code, role) {
    try {
        let res = await fetch(backendURL + "v1/oauth/github", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({'code': code, "role": role})
        });
        res = await res.json();
        return res
    }
    catch (e) {
        return e
    }
}

export async function getMe() {
    try {
        sessionStorage.getItem("token")
        let res = await fetch(backendURL + "v1/users/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "content-type": "application/json" },
        });
        res = await res.json();
        if (!res.ok) {
            console.log(res)
            console.log(res.status)
            console.log(res.statusText)
        }
        return res
        
    }
    catch (e) {
        console.log(e)
        return e
    }
}
