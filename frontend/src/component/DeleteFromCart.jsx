import React, { useState } from 'react';
import axios from 'axios';

function DeleteFromCart() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const handleDelete = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        const productId = localStorage.getItem('productId');

        if (!userId || !productId || !name) {
            alert("All fields must be filled.");
            return;
        }

        setLoading(true);
        setError('');
        console.log("Form is being submitted!");

        try {
            const response = await axios.delete(`http://localhost:8083/api/deleteProduct/${userId}/${productId}`, {
                data: { name },
            });

            setMessage("Product successfully deleted from cart!");
            console.log(response.data);
        } catch (error) {
            console.error('There was an error!', error);
            setError('Error deleting product from cart. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Delete Product From Cart</h1>
            <form onSubmit={handleDelete}>
                <div className="find">
                    <label htmlFor="name">Product Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Product Name"
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Deleting Product...' : 'Delete Product'}
                </button>
            </form>
        </div>
    );
}

export default DeleteFromCart;