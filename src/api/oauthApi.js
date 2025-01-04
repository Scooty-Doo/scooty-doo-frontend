const backendURL = "http://localhost:8000/"

export async function fetchLogin(code) {
    try {
        let res = await fetch(backendURL + "v1/oauth/github", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({'code': code})
        });
        res = await res.json();
        return res
    }
    catch (e) {
        return e
    }
}
