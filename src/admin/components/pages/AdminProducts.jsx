import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchAdminProducts,
  addAdminProduct,
  editAdminProduct,
  removeAdminProduct,
  fetchAdminGames,
  addAdminGame,
  editAdminGame,
  removeAdminGame,
} from "../../../redux/slices/adminSlice";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Gamepad2,
  Package,
} from "lucide-react";

const initialForm = {
  name: "",
  brand: "",
  category: "",
  platform: "",
  price: "",
  stock: "",
  rating: "4.5",
  image: "",
  description: "",
};

const AdminProducts = () => {
  const dispatch = useDispatch();

  const { products, games, loading } = useSelector(
    (state) => state.admin
  );

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [formType, setFormType] = useState("product");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const [formData, setFormData] = useState(initialForm);

  // FETCH PRODUCTS AND GAMES
  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminGames());
  }, [dispatch]);

  // COMBINE PRODUCTS AND GAMES
  const allItems = useMemo(() => {
    const productItems = products.map((item) => ({
      ...item,
      itemType: "product",
    }));

    const gameItems = games.map((item) => ({
      ...item,
      itemType: "game",
    }));

    return [...productItems, ...gameItems];
  }, [products, games]);

  // FILTER ITEMS
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesTab =
        activeTab === "all" || item.itemType === activeTab;

      const searchText = `
        ${item.name || ""}
        ${item.brand || ""}
        ${item.category || ""}
        ${item.platform || ""}
      `.toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      return matchesTab && matchesSearch;
    });
  }, [allItems, activeTab, search]);

  // PAGINATION
  const totalPages = Math.ceil(
    filteredItems.length / itemsPerPage
  );

  const displayedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // OPEN ADD FORM
  const openAddForm = (type) => {
    setEditingId(null);
    setEditingType(null);
    setFormType(type);
    setFormData(initialForm);
    setShowForm(true);
  };

  // OPEN EDIT FORM
  const openEditForm = (item) => {
    setEditingId(item.id);
    setEditingType(item.itemType);
    setFormType(item.itemType);

    setFormData({
      name: item.name || "",
      brand: item.brand || "",
      category: item.category || "",
      platform: item.platform || "",
      price: item.price ?? "",
      stock: item.stock ?? "",
      rating: item.rating ?? "4.5",
      image: item.image || "",
      description: item.description || "",
    });

    setShowForm(true);
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ADD / UPDATE
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

    if (formType === "game" && !formData.platform.trim()) {
      toast.error("Please enter the game platform");
      return;
    }

    const itemData = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      rating: Number(formData.rating),
      image: formData.image.trim(),
      description: formData.description.trim(),
    };

    if (formType === "game") {
      itemData.platform = formData.platform.trim();
    }

    try {
      if (editingId !== null) {
        if (editingType === "game") {
          await dispatch(
            editAdminGame({
              id: editingId,
              game: itemData,
            })
          ).unwrap();

          toast.success("Game updated successfully");
        } else {
          await dispatch(
            editAdminProduct({
              id: editingId,
              product: itemData,
            })
          ).unwrap();

          toast.success("Product updated successfully");
        }
      } else {
        if (formType === "game") {
          await dispatch(addAdminGame(itemData)).unwrap();
          toast.success("Game added successfully");
        } else {
          await dispatch(addAdminProduct(itemData)).unwrap();
          toast.success("Product added successfully");
        }

        setCurrentPage(1);
      }

      setShowForm(false);
      setEditingId(null);
      setEditingType(null);
      setFormData(initialForm);
    } catch (error) {
      toast.error(error || "Something went wrong");
    }
  };

  // DELETE ITEM
  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${item.itemType}?`
    );

    if (!confirmDelete) return;

    try {
      if (item.itemType === "game") {
        await dispatch(removeAdminGame(item.id)).unwrap();
        toast.success("Game deleted successfully");
      } else {
        await dispatch(removeAdminProduct(item.id)).unwrap();
        toast.success("Product deleted successfully");
      }

      if (displayedItems.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      }
    } catch (error) {
      toast.error(error || "Failed to delete item");
    }
  };

  // CHANGE TAB
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-w-0 p-4 md:p-6 text-white overflow-x-hidden">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Products & Games
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Manage your GAME DOCK products and games.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => openAddForm("product")}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm font-semibold"
          >
            <Plus size={17} />
            Add Product
          </button>

          <button
            onClick={() => openAddForm("game")}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg text-sm font-semibold"
          >
            <Gamepad2 size={17} />
            Add Game
          </button>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">

        <div className="bg-[#151b27] border border-gray-800 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <Package className="text-red-400" size={22} />
            <div>
              <p className="text-gray-400 text-xs">Total Items</p>
              <h2 className="text-xl font-bold">{allItems.length}</h2>
            </div>
          </div>
        </div>

        <div className="bg-[#151b27] border border-gray-800 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <Package className="text-blue-400" size={22} />
            <div>
              <p className="text-gray-400 text-xs">Products</p>
              <h2 className="text-xl font-bold">{products.length}</h2>
            </div>
          </div>
        </div>

        <div className="bg-[#151b27] border border-gray-800 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <Gamepad2 className="text-purple-400" size={22} />
            <div>
              <p className="text-gray-400 text-xs">Games</p>
              <h2 className="text-xl font-bold">{games.length}</h2>
            </div>
          </div>
        </div>

      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: "All Items", value: "all" },
          { label: "Products", value: "product" },
          { label: "Games", value: "game" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.value
                ? "bg-red-600 text-white"
                : "bg-[#151b27] text-gray-400 hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="relative mb-4 max-w-sm">
        <Search
          className="absolute left-3 top-2.5 text-gray-400"
          size={18}
        />

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search products and games..."
          className="w-full bg-[#151b27] border border-gray-700 rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:border-red-500"
        />
      </div>

      {/* ITEMS TABLE */}
      <div className="bg-[#151b27] border border-gray-800 rounded-xl overflow-hidden w-full min-w-0">

        {loading ? (
          <p className="p-8 text-center text-gray-400">
            Loading items...
          </p>
        ) : filteredItems.length === 0 ? (
          <p className="p-8 text-center text-gray-400">
            No items found.
          </p>
        ) : (
          <div className="w-full min-w-0">
            <table className="w-full table-fixed text-left">

              <thead className="bg-[#0d121d] text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-3 py-3 w-[48%]">Item</th>
                  <th className="px-2 py-3 w-[20%]">Price</th>
                  <th className="px-2 py-3 w-[14%]">Stock</th>
                  <th className="px-2 py-3 w-[18%] text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {displayedItems.map((item) => (
                  <tr
                    key={`${item.itemType}-${item.id}`}
                    className="border-t border-gray-800 hover:bg-white/5 transition"
                  >
                    {/* ITEM */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 shrink-0 object-contain rounded bg-white/5 p-1"
                        />

                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.name}
                          </p>

                          <span
                            className={`text-[10px] ${
                              item.itemType === "game"
                                ? "text-purple-400"
                                : "text-blue-400"
                            }`}
                          >
                            {item.itemType === "game" ? "Game" : "Product"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="px-2 py-2.5 text-sm font-medium whitespace-nowrap">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </td>

                    {/* STOCK */}
                    <td className="px-2 py-2.5 text-sm">
                      <span
                        className={
                          Number(item.stock) < 3
                            ? "text-red-400"
                            : "text-green-400"
                        }
                      >
                        {item.stock}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-2 py-2.5">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => openEditForm(item)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Edit item"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete item"
                        >
                          <Trash2 size={17} />
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
        <div className="flex justify-center items-center gap-3 mt-5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
            className="px-3 py-1.5 text-sm bg-[#151b27] rounded-lg disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-gray-300 text-sm">
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="px-3 py-1.5 text-sm bg-[#151b27] rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">

          <div className="bg-[#151b27] border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5">

            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl font-bold">
                  {editingId !== null
                    ? `Edit ${formType === "game" ? "Game" : "Product"}`
                    : `Add ${formType === "game" ? "Game" : "Product"}`}
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Enter the item information below.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { name: "name", label: "Name" },
                  { name: "brand", label: "Brand" },
                  { name: "category", label: "Category" },

                  ...(formType === "game"
                    ? [{ name: "platform", label: "Platform" }]
                    : []),

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
                      className="w-full mt-1.5 bg-[#080b12] border border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:border-red-500"
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
                  placeholder="/images/game.png"
                  className="w-full mt-1.5 bg-[#080b12] border border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:border-red-500"
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
                  rows="3"
                  className="w-full mt-1.5 bg-[#080b12] border border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 py-2.5 rounded-lg text-sm font-semibold"
              >
                {editingId !== null ? "Update" : "Save"}{" "}
                {formType === "game" ? "Game" : "Product"}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;