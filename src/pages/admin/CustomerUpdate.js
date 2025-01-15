import React, { useState, useEffect } from "react";
import styles from "../../styles/CustomerUpdate.module.css";
import { useParams } from "react-router-dom";
import { fetchUser, userDetails3 } from "../../api/userApi";

const CustomerDetails = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedData, setUpdatedData] = useState({});
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetchUser(userId);
                console.log("user data:", response);
                setUser(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching user details:", err);
                setError("Failed to fetch user details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleEdit = () => {
        setIsEditing(true);
        setUpdatedData({
            full_name: user.attributes?.full_name,
            email: user.attributes?.email,
            github_login: user.attributes?.github_login,
            use_prepay: user.attributes?.use_prepay,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: name === "use_prepay" ? value === "true" : value,
        }));
    };

    const handleSave = async () => {
        const { full_name, email, github_login, use_prepay } = updatedData;

        try {
            const response = await userDetails3(
                userId,
                full_name,
                email,
                github_login,
                use_prepay
            );

            setUser({ ...user, attributes: { ...user.attributes, ...response } });
            setIsEditing(false);
            window.location.reload();
            setError(null);
        } catch (err) {
            console.error("Error updating user details:", err);
            setError("Failed to update user details. Please try again later.");
        }
    };

    if (loading) {
        return <p>Loading user details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!user) {
        return <p>No user data found.</p>;
    }

    return (
        <div className={styles.container}>
            <h2>User Details</h2>
            {isEditing ? (
                <div>
                    <p>
                        <strong>Full Name:</strong>
                        <input
                            type="text"
                            name="full_name"
                            value={updatedData.full_name}
                            onChange={handleChange}
                        />
                    </p>
                    <p>
                        <strong>Email:</strong>
                        <input
                            type="email"
                            name="email"
                            value={updatedData.email}
                            onChange={handleChange}
                        />
                    </p>
                    <p>
                        <strong>GitHub Login:</strong>
                        <input
                            type="text"
                            name="github_login"
                            value={updatedData.github_login}
                            onChange={handleChange}
                        />
                    </p>
                    <p>
                        <strong>Use Prepay:</strong>
                        <br></br>
                        <select
                            name="use_prepay"
                            value={updatedData.use_prepay}
                            onChange={handleChange}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </p>
                    <button onClick={handleSave}>Save</button>
                </div>
            ) : (
                <div>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Full Name:</strong> {user.attributes?.full_name}</p>
                    <p><strong>Email:</strong> {user.attributes?.email}</p>
                    <p><strong>GitHub Login:</strong> {user.attributes?.github_login}</p>
                    <p><strong>Balance:</strong> {user.attributes?.balance}</p>
                    <p><strong>Use Prepay:</strong> {user.attributes?.use_prepay ? "Yes" : "No"}</p>
                    <p><strong>Created At:</strong> {new Date(user.attributes?.created_at).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(user.attributes?.updated_at).toLocaleString()}</p>
                    <button onClick={handleEdit}>Edit</button>
                </div>
            )}
        </div>
    );
};

export default CustomerDetails;
