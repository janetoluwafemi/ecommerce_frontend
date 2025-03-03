import React, { useState } from 'react';
import axios from 'axios';

function FindProduct() {
    const [name, setName] = useState('');
    const [productId, setProductId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');

        if (!userId) {
            setError('User is not logged in. Please log in first.');
            setLoading(false);
            return;
        }
        console.log('Form submitted with name:', name);

        if (!name) {
            alert("Please enter a Product name.");
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');
        setProductId('');

        try {
            const url = `http://localhost:8083/api/product/${userId}${name}`;
            console.log('Making API request to:', url);

            const response = await axios.get(url);
            console.log('API Response:', response);

            if (response.data && response.data.productId) {
                setProductId(response.data.productId);
                setMessage(`Product ID found: ${response.data.productId}`);

                localStorage.setItem('productId', response.data.productId);
                console.log('Product found successfully:', response.data);
                window.location.href = "/delete_product";
                console.log(sessionStorage, 'hiiii')
            } else {
                setError('Product not found.');
            }
        } catch (error) {
            console.error('There was an error finding the product!', error);
            setError(`Failed to find the product. ${error.message || 'Please try again.'}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <h1>Find Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="find">
                    <label htmlFor="name">Product Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Product name"
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Finding Product...' : 'Find Product'}
                </button>
            </form>
        </div>
    );
}

export default FindProduct;
