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
        console.log('Form submitted with name:', name);

        if (!name) {
            alert("Please enter a card name.");
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');
        setProductId('');

        try {
            const url = `http://localhost:8083/api/product/${name}`;
            console.log('Making API request to:', url);

            const response = await axios.get(url);
            console.log('API Response:', response);

            if (response.data && response.data.productId) {
                setProductId(response.data.productId);
                setMessage(`Card ID found: ${response.data.productId}`);

                localStorage.setItem('cardId', response.data.productId);
                console.log('Card found successfully:', response.data);
                window.location.href = "/delete_product";
                console.log(sessionStorage, 'hiiii')
            } else {
                setError('Card not found.');
            }
        } catch (error) {
            console.error('There was an error finding the card!', error);
            setError(`Failed to find the card. ${error.message || 'Please try again.'}`);
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
