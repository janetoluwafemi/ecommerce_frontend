
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeleteCard() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [productId, setProductId] = useState('');

    console.log(sessionStorage.getItem('productId'), 'yoyoy')

    const handleDelete = async (e) => {
        e.preventDefault();

        setProductId(localStorage.getItem('productId'));
        console.log(productId, 'hiii')

        if (!productId) {
            alert("Please enter a card ID.");
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await axios.delete(`http://localhost:8083/api/deleteProduct/${sessionStorage.getItem('cardId')}`);
            setMessage(response.data.message);
            console.log('product deleted successfully:', response.data);
        } catch (error) {
            console.error('There was an error deleting the product!', error);
            setError('Failed to delete the product. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="delete-product-container">
            <h1>Delete product</h1>
            <form onSubmit={handleDelete} className="delete-product-form">
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete product'}
                </button>
            </form>
        </div>
    );
}

export default DeleteCard;
