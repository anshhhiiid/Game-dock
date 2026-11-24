import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchAdminProducts,
  addAdminProduct,
  editAdminProduct,
  removeAdminProduct,
} from "../../../redux/slices/adminSlice";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

const initialForm = {
  name: "",
  brand: "",
  category: "",
  price: "",
  stock: "",
  rating: "4.5",
  image: "",
  description: "",
};

const AdminProducts = () => {
  const dispatch = useDispatch();

  const { products, loading } = useSelector(
    (state) => state.admin
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      `${product.name} ${product.brand} ${product.category}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [products, search]);

  const totalPages = Math.ceil(
    filteredProducts.length / itemsPerPage
  );

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openAddForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);

    setFormData({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      rating: product.rating ?? "4.5",
      image: product.image || "",
      description: product.description || "",
    });

    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.brand.trim() ||
      !formData.category.trim() ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      rating: Number(formData.rating),
    };

    try {
      if (editingId !== null) {
        await dispatch(
          editAdminProduct({
            id: editingId,
            product: productData,
          })
        ).unwrap();

        toast.success("Product updated successfully");
      } else {
        await dispatch(
          addAdminProduct(productData)
        ).unwrap();

        toast.success("Product added successfully");
        setCurrentPage(1);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(initialForm);
    } catch (error) {
      toast.error(error || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await dispatch(removeAdminProduct(id)).unwrap();

      toast.success("Product deleted successfully");

      if (displayedProducts.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      }
    } catch (error) {
      toast.error(error || "Failed to delete product");
    }
  };

  return (
    <div className="p-5 md:p-8 text-white">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row justify-between gap-5 mb-8">

        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-400 mt-2">
            Manage your GAME DOCK products.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg font-semibold"
        >
          <Plus size={20} />
          Add Product
        </button>

      </div>

      {/* SEARCH */}

      <div className="relative mb-6 max-w-md">

        <Search
          className="absolute left-3 top-3 text-gray-400"
          size={20}
        />

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search products..."
          className="w-full bg-[#151b27] border border-gray-700 rounded-lg pl-11 pr-4 py-3 outline-none focus:border-red-500"
        />

      </div>

      {/* PRODUCT TABLE */}

      <div className="bg-[#151b27] border border-gray-800 rounded-xl overflow-hidden">

        {loading ? (
          <p className="p-10 text-center text-gray-400">
            Loading products...
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="p-10 text-center text-gray-400">
            No products found.
          </p>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left">

              <thead className="bg-[#0d121d] text-gray-400 text-sm">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {displayedProducts.map((product) => (

                  <tr
                    key={product.id}
                    className="border-t border-gray-800 hover:bg-white/5"
                  >

                    <td className="p-4">
                      <div className="flex items-center gap-3">

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-contain rounded bg-white/5"
                        />

                        <span className="font-medium">
                          {product.name}
                        </span>

                      </div>
                    </td>

                    <td className="p-4 text-gray-300">
                      {product.brand}
                    </td>

                    <td className="p-4 text-gray-300">
                      {product.category}
                    </td>

                    <td className="p-4">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                      <span
                        className={
                          product.stock < 3
                            ? "text-red-400"
                            : "text-green-400"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-3">

                        <button
                          onClick={() => openEditForm(product)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Edit product"
                        >
                          <Pencil size={19} />
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete product"
                        >
                          <Trash2 size={19} />
                        </button>

                      </div>
                    </td>

                  </tr>

                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
            className="px-4 py-2 bg-[#151b27] rounded disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="px-4 py-2 bg-[#151b27] rounded disabled:opacity-40"
          >
            Next
          </button>

        </div>
      )}

      {/* ADD / EDIT MODAL */}

      {showForm && (

        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">

          <div className="bg-[#151b27] border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                {editingId !== null ? "Edit Product" : "Add Product"}
              </h2>

              <button onClick={() => setShowForm(false)}>
                <X className="text-gray-400" />
              </button>

            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid sm:grid-cols-2 gap-4">

                {[
                  { name: "name", label: "Product Name" },
                  { name: "brand", label: "Brand" },
                  { name: "category", label: "Category" },
                  { name: "price", label: "Price", type: "number" },
                  { name: "stock", label: "Stock", type: "number" },
                  { name: "rating", label: "Rating", type: "number" },
                ].map((field) => (

                  <div key={field.name}>
                    <label className="text-gray-300 text-sm">
                      {field.label}
                    </label>

                    <input
                      name={field.name}
                      type={field.type || "text"}
                      value={formData[field.name]}
                      onChange={handleChange}
                      min={field.type === "number" ? "0" : undefined}
                      step={field.name === "rating" ? "0.1" : "1"}
                      required
                      className="w-full mt-2 bg-[#080b12] border border-gray-700 rounded-lg p-3 outline-none focus:border-red-500"
                    />
                  </div>

                ))}

              </div>

              <div>
                <label className="text-gray-300 text-sm">
                  Image Path
                </label>

                <input
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="/images/product.png"
                  className="w-full mt-2 bg-[#080b12] border border-gray-700 rounded-lg p-3 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full mt-2 bg-[#080b12] border border-gray-700 rounded-lg p-3 outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold"
              >
                {editingId !== null ? "Update Product" : "Save Product"}
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminProducts;