import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/SignUp.css';

function SignUp() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        accountNumber: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.email || !formData.password || !formData.accountNumber || !formData.address) {
            alert("Please fill in all required fields.");
            return;
        }
        setLoading(true);
        setError('');
        console.log("Form is being submitted!");

        axios.post('http://localhost:8083/api/users', formData)
            .catch(error => {
                console.error('There was an error!', error);
                if (error.response && error.response.data.message === 'Email or Phone Number already in use.') {
                    setError('This email or phone number is already registered. Please use a different one.');
                } else {
                    setError('Registration failed. Please try again.');
                }
            })
            .then(response => {
                const userId = response.data.userId;
                sessionStorage.setItem('userId', userId);
                localStorage.setItem('userId', userId);
                console.log(userId)
                console.log(response.data)
                console.log(sessionStorage, 'hiiii')
                alert("User registered successfully!");
                window.location.href = "/create_product";
                console.log(sessionStorage, 'hiiii')
            })

            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="signup-container">
            <div className="signup-header">
                <h1>Sign Up Page</h1>
                <p>This is the Sign Up page.</p>
            </div>
            <div className="signup-form-container">
                <form onSubmit={handleSubmit}>  {/* Add onSubmit handler */}
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="Enter First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Enter Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="Enter Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="accountNumber">Account Number:</label>
                        <input
                            type="text"
                            id="accountNumber"
                            name="accountNumber"
                            placeholder="Enter Account Number"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Enter Address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
