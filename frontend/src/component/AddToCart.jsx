import React, {useState} from 'react';
import axios from "axios";

function AddToCart() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        console.log(userId, 'userId in handleSubmit');

        if (!userId) {
            alert("Please enter a user ID.");
        }
        const productId = localStorage.getItem('productId');
        console.log(productId, 'productId in handleSubmit');

        if (!productId) {
            alert("Please enter a product ID.");
            return;
        }
        if (!name || !userId || !productId) {
            alert("All fields must be filled.");
            return;
        }
        setLoading(true);
        setError('');
        console.log("Form is being submitted!");

        try {
            const response = await axios.post(`http://localhost:8083/api/addProduct/${userId}/${productId}`, {
                name: name,
            });
            setMessage("Product successfully added to cart!");
            console.log(response.data);
        } catch (error) {
            console.error('There was an error!', error);
            setError('Error adding product to cart. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <h1>Add Product To Cart</h1>
            <form onSubmit={handleSubmit}>
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
                    {loading ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>)
}

export default AddToCart;