// // src/components/ProductForm.js
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// // import './styles.css';

// function ProductForm() {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     quantity: '',
//   });

//   const { id } = useParams();  // Retrieve product ID from URL params (if editing)
//   const navigate = useNavigate();  // Hook to navigate between pages

//   // Fetch product data if editing
//   useEffect(() => {
//     if (id) {
//       const fetchProduct = async () => {
//         try {
//           const response = await axios.get(`http://localhost:5002/products/${id}`);
//           setFormData(response.data);
//         } catch (error) {
//           console.error('Error fetching product:', error);
//         }
//       };
//       fetchProduct();
//     }
//   }, [id]);  // Only re-run if 'id' changes

//   // Handle form field changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault(); // Prevent page refresh
  
// //     console.log('Form data:', formData); // Log the form data
  
// //     try {
// //       if (id) {
// //         console.log('Updating product...');
// //         await axios.put(`http://localhost:5002/products/${id}`, formData);
// //       } else {
// //         console.log('Adding new product...');
// //         await axios.post('http://localhost:5002/products', formData);
// //       }
  
// //       console.log('Redirecting to home...');
// //       navigate('/'); // Attempt to navigate to the home page
// //     } catch (error) {
// //       console.error('Error saving product:', error);
// //     }
// //   };

// const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent page refresh
  
//     // Validation for price and quantity
//     if (formData.price <= 0 || isNaN(formData.price)) {
//       alert('Error: Price must be a positive number.');
//       return;
//     }
  
//     if (formData.quantity <= 0 || !Number.isInteger(Number(formData.quantity))) {
//       alert('Error: Quantity must be a positive integer.');
//       return;
//     }
  
//     console.log('Form data:', formData); // Log the form data
  
//     try {
//       if (id) {
//         console.log('Updating product...');
//         await axios.put(`http://localhost:5002/products/${id}`, formData);
//       } else {
//         console.log('Adding new product...');
//         await axios.post('http://localhost:5002/products', formData);
//       }
  
//       console.log('Redirecting to home...');
//       navigate('/'); // Redirect to home page after success
//     } catch (error) {
//       console.error('Error saving product:', error);
//       alert('Error saving product. Please try again.');
//     }
//   };
  
  
//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="mb-3">
//         <label className="form-label">Name</label>
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleInputChange}
//           className="form-control"
//           required
//         />
//       </div>
//       <div className="mb-3">
//         <label className="form-label">Description</label>
//         <input
//           type="text"
//           name="description"
//           value={formData.description}
//           onChange={handleInputChange}
//           className="form-control"
//           required
//         />
//       </div>
//       <div className="mb-3">
//         <label className="form-label">Price</label>
//         <input
//           type="number"
//           name="price"
//           value={formData.price}
//           onChange={handleInputChange}
//           className="form-control"
//           required
//         />
//       </div>
//       <div className="mb-3">
//         <label className="form-label">Quantity</label>
//         <input
//           type="number"
//           name="quantity"
//           value={formData.quantity}
//           onChange={handleInputChange}
//           className="form-control"
//           required
//         />
//       </div>
//       <button type="submit" className="btn btn-success">
//         {id ? 'Update Product' : 'Add Product'}
//       </button>
//     </form>
//   );
// }

// export default ProductForm;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
// import './styles.css';

function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });
  const { id } = useParams();  // Get product ID from URL if editing
  const navigate = useNavigate();  // Hook to navigate between pages
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch product data for editing
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:5002/products/${id}`);
          setFormData({
            name: response.data.name || '',
            description: response.data.description || '',
            price: response.data.price || '',
            quantity: response.data.quantity || '',
          });
        } catch (error) {
          console.error('Error fetching product:', error);
          alert('Error fetching product data.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  // Handle input changes and update state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    // Validate price and quantity inputs
    if (formData.price <= 0 || isNaN(formData.price)) {
      alert('Error: Price must be a positive number.');
      return;
    }

    if (formData.quantity <= 0 || !Number.isInteger(Number(formData.quantity))) {
      alert('Error: Quantity must be a positive integer.');
      return;
    }

    try {
      if (id) {
        // Update product if editing
        await axios.put(`http://localhost:5002/products/${id}`, formData);
        console.log('Product updated:', formData);
      } else {
        // Add new product if not editing
        await axios.post('http://localhost:5002/products', formData);
        console.log('New product added:', formData);
      }
      navigate('/'); // Redirect to product list
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading product data...</p>; // Show loading message
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="number"
          step="0.01" // Allow float values for price
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </div>
      <button type="submit" className="btn btn-success">
        {id ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
}

export default ProductForm;

