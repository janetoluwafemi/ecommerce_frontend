import React, {useState} from 'react';
import axios from "axios";
import '../styles/CreateProduct.css'

function CreateProduct() {
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [imagePreview, setImagePreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !category || !price || !description || !image) {
            alert("All fields must be filled.");
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:8083/api/createProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const productId = response.data.productId;
            sessionStorage.setItem('productId', productId);
            localStorage.setItem('productId', productId);
            console.log('Product created successfully:', response.data);
            alert("Product created successfully!");
            window.location.href = "/delete_product";
            console.log(sessionStorage, 'hiiii')
        } catch (error) {
            console.error('Error creating product:', error);
            setError("Error creating product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="CreateProduct">
            <h1>Create New Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
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

                <div className="form-group">
                    <label htmlFor="imageFile">Product Image:</label>
                    <input
                        type="file"
                        id="imageFile"
                        name="imageFile"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                    />
                </div>

                {imagePreview && (
                    <div className="form-group">
                        <label>Preview Image:</label>
                        <img src={imagePreview} alt="Product Preview" width="100" height="100"/>
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="name">Product category:</label>
                    <input
                        type="category"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Enter Product category"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Product Price:</label>
                    <input
                        type="price"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter Product Price"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Enter Product Description:</label>
                    <input
                        type="description"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter Description"
                        required
                    />
                </div>
                <button type="submit">Create Product</button>
            </form>
        </div>
    );
}

export default CreateProduct;