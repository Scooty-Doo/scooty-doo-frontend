import React, { useState } from 'react';
import styles from "../../styles/CustomerAdmin.module.css";
import { fetchCustomer } from "../../api/customerApi";
import { useNavigate } from "react-router-dom";

const Customer = () => {
    const [nameSearch, setNameSearch] = useState("");
    const [emailSearch, setEmailSearch] = useState("");
    const [githubLoginSearch, setGithubLoginSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRowClick = (userId) => {
        navigate(`/customerupdate/${userId}`);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            console.log("Starting search...");

            const data = await fetchCustomer({
                name_search: nameSearch,
                email_search: emailSearch,
                github_login_search: githubLoginSearch,
            });

            console.log("API Response:", data);

            setSearchResults(data.data || []); 
            setError(null);
        } catch (err) {
            console.error("Error searching:", err);
            setError("Failed to fetch search results. Please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <h2>Search Users</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by email"
                    value={emailSearch}
                    onChange={(e) => setEmailSearch(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by GitHub login"
                    value={githubLoginSearch}
                    onChange={(e) => setGithubLoginSearch(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {error && <p className={styles.error}>{error}</p>}


            <h3>Search Results</h3>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>GitHub Login</th>
                        <th>Balance</th>
                        <th>Use Prepay</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.length > 0 ? (
                        searchResults.map((user) => (
                            <tr
                                key={user.id}
                                onClick={() => handleRowClick(user.id)}
                            >
                                <td>{user.id}</td>
                                <td>{user.attributes.full_name}</td>
                                <td>{user.attributes.email}</td>
                                <td>{user.attributes.github_login}</td>
                                <td>{user.attributes.balance}</td>
                                <td>{user.attributes.use_prepay ? "Yes" : "No"}</td>
                                <td>{new Date(user.attributes.created_at).toLocaleString()}</td>
                                <td>{new Date(user.attributes.updated_at).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: "center" }}>
                                No users found. Please try a different search.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    );
};

export default Customer;
