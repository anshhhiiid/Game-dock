import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchAdminProducts,
  addAdminProduct,
  editAdminProduct,
  removeAdminProduct,
  restoreAdminProduct,
  permanentlyDeleteAdminProduct,

  fetchAdminGames,
  addAdminGame,
  editAdminGame,
  removeAdminGame,
  restoreAdminGame,
  permanentlyDeleteAdminGame,
} from "../../../redux/slices/adminSlice";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Gamepad2,
  Package,
  RotateCcw,
  Archive,
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

  // ==============================
  // FETCH PRODUCTS AND GAMES
  // ==============================

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminGames());
  }, [dispatch]);

  // ==============================
  // COMBINE PRODUCTS AND GAMES
  // ==============================

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

  // ACTIVE AND DELETED ITEMS

  const activeItems = allItems.filter(
    (item) => item.isDeleted !== true
  );

  const deletedItems = allItems.filter(
    (item) => item.isDeleted === true
  );

  const activeProducts = products.filter(
    (item) => item.isDeleted !== true
  );

  const activeGames = games.filter(
    (item) => item.isDeleted !== true
  );

  // ==============================
  // FILTER ITEMS
  // ==============================

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const isDeleted = item.isDeleted === true;

      const matchesTab =
        activeTab === "deleted"
          ? isDeleted
          : !isDeleted &&
            (activeTab === "all" ||
              item.itemType === activeTab);

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

  // ==============================
  // PAGINATION
  // ==============================

  const totalPages = Math.ceil(
    filteredItems.length / itemsPerPage
  );

  const displayedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ==============================
  // CUSTOM CONFIRMATION TOAST
  // ==============================

  const showConfirmation = ({
    title,
    message,
    confirmText = "OK",
    danger = false,
    onConfirm,
  }) => {
    toast(
      (t) => (
        <div className="w-full">
          <div className="mb-4">
            <h3 className="text-white font-semibold text-sm">
              {title}
            </h3>

            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-[#252525] text-gray-300 hover:bg-[#333333] transition"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await onConfirm();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition ${
                danger
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          background: "#000000",
          color: "#ffffff",
          border: "1px solid #333333",
          borderRadius: "12px",
          padding: "16px",
          minWidth: "320px",
          maxWidth: "420px",
        },
      }
    );
  };

  // ==============================
  // OPEN ADD FORM
  // ==============================

  const openAddForm = (type) => {
    setEditingId(null);
    setEditingType(null);
    setFormType(type);
    setFormData(initialForm);
    setShowForm(true);
  };

  // ==============================
  // OPEN EDIT FORM
  // ==============================

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

  // ==============================
  // HANDLE INPUT
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==============================
  // ADD / UPDATE
  // ==============================

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

  // ==============================
  // MOVE ITEM TO RECYCLE BIN
  // ==============================

  const handleDelete = (item) => {
    showConfirmation({
      title: "Move to Recently Deleted?",
      message: `${item.name} will be removed from the customer shop and moved to Recently Deleted. You can restore it later.`,
      confirmText: "Move to Bin",
      danger: true,

      onConfirm: async () => {
        try {
          if (item.itemType === "game") {
            await dispatch(
              removeAdminGame(item.id)
            ).unwrap();

            toast.success("Game moved to Recently Deleted");
          } else {
            await dispatch(
              removeAdminProduct(item.id)
            ).unwrap();

            toast.success("Product moved to Recently Deleted");
          }

          setCurrentPage(1);
        } catch (error) {
          toast.error(error || "Failed to delete item");
        }
      },
    });
  };

  // ==============================
  // RESTORE ITEM
  // ==============================

  const handleRestore = async (item) => {
    try {
      if (item.itemType === "game") {
        await dispatch(
          restoreAdminGame(item.id)
        ).unwrap();

        toast.success("Game restored successfully");
      } else {
        await dispatch(
          restoreAdminProduct(item.id)
        ).unwrap();

        toast.success("Product restored successfully");
      }

      setCurrentPage(1);
    } catch (error) {
      toast.error(error || "Failed to restore item");
    }
  };

  // ==============================
  // PERMANENT DELETE
  // ==============================

  const handlePermanentDelete = (item) => {
    showConfirmation({
      title: "Permanently Delete?",
      message: `Are you sure you want to permanently delete ${item.name}? This action cannot be undone and the item cannot be restored.`,
      confirmText: "Delete Forever",
      danger: true,

      onConfirm: async () => {
        try {
          if (item.itemType === "game") {
            await dispatch(
              permanentlyDeleteAdminGame(item.id)
            ).unwrap();

            toast.success("Game permanently deleted");
          } else {
            await dispatch(
              permanentlyDeleteAdminProduct(item.id)
            ).unwrap();

            toast.success("Product permanently deleted");
          }

          setCurrentPage(1);
        } catch (error) {
          toast.error(error || "Permanent deletion failed");
        }
      },
    });
  };

  // ==============================
  // CHANGE TAB
  // ==============================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearch("");
  };

  // ==============================
  // TAB STYLING
  // ==============================

  const getTabClass = (isActive) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
        : "bg-[#151b27] text-gray-400 hover:bg-purple-500/10 hover:text-purple-300"
    }`;

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
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg text-sm font-semibold transition"
          >
            <Plus size={17} />
            Add Product
          </button>

          <button
            onClick={() => openAddForm("game")}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg text-sm font-semibold transition"
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
            <Package className="text-purple-400" size={22} />

            <div>
              <p className="text-gray-400 text-xs">
                Total Active Items
              </p>

              <h2 className="text-xl font-bold">
                {activeItems.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-[#151b27] border border-gray-800 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <Package className="text-blue-400" size={22} />

            <div>
              <p className="text-gray-400 text-xs">
                Products
              </p>

              <h2 className="text-xl font-bold">
                {activeProducts.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-[#151b27] border border-gray-800 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <Gamepad2 className="text-purple-400" size={22} />

            <div>
              <p className="text-gray-400 text-xs">
                Games
              </p>

              <h2 className="text-xl font-bold">
                {activeGames.length}
              </h2>
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
            className={getTabClass(activeTab === tab.value)}
          >
            {tab.label}
          </button>
        ))}

        {/* RECYCLE BIN */}

        <button
          onClick={() => handleTabChange("deleted")}
          className={`flex items-center gap-2 ${getTabClass(
            activeTab === "deleted"
          )}`}
        >
          <Archive size={16} />

          Recently Deleted

          {deletedItems.length > 0 && (
            <span className="bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full">
              {deletedItems.length}
            </span>
          )}
        </button>

      </div>

      {/* RECYCLE BIN INFO */}

      {activeTab === "deleted" && (
        <div className="flex items-start gap-3 bg-purple-500/5 border border-purple-500/20 rounded-xl p-3 mb-4">
          <Archive
            size={19}
            className="text-purple-400 shrink-0 mt-0.5"
          />

          <div>
            <p className="text-sm font-medium text-white">
              Recently Deleted
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Items here are hidden from customers. Restore them anytime or permanently delete them.
            </p>
          </div>
        </div>
      )}

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
          placeholder={
            activeTab === "deleted"
              ? "Search deleted items..."
              : "Search products and games..."
          }
          className="w-full bg-[#151b27] border border-gray-700 rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:border-purple-500"
        />
      </div>

      {/* ITEMS TABLE */}

      <div className="bg-[#151b27] border border-gray-800 rounded-xl overflow-hidden w-full min-w-0">

        {loading ? (
          <p className="p-8 text-center text-gray-400">
            Loading items...
          </p>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <Archive
              size={35}
              className="mx-auto text-gray-600 mb-3"
            />

            <p className="text-gray-300 font-medium">
              {activeTab === "deleted"
                ? "Recycle bin is empty"
                : "No items found"}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              {activeTab === "deleted"
                ? "Deleted products and games will appear here."
                : "Try changing your search or category."}
            </p>
          </div>
        ) : (
          <div className="w-full min-w-0">
            <table className="w-full table-fixed text-left">
              <thead className="bg-[#0d121d] text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-3 py-3 w-[43%]">
                    Item
                  </th>

                  <th className="px-2 py-3 w-[19%]">
                    Price
                  </th>

                  <th className="px-2 py-3 w-[14%]">
                    Stock
                  </th>

                  <th className="px-2 py-3 w-[24%] text-center">
                    Actions
                  </th>
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
                            {item.itemType === "game"
                              ? "Game"
                              : "Product"}
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

                        {activeTab === "deleted" ? (
                          <>
                            <button
                              onClick={() => handleRestore(item)}
                              className="text-green-400 hover:text-green-300 transition"
                              title="Restore item"
                            >
                              <RotateCcw size={18} />
                            </button>

                            <button
                              onClick={() => handlePermanentDelete(item)}
                              className="text-red-400 hover:text-red-300 transition"
                              title="Permanently delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => openEditForm(item)}
                              className="text-purple-400 hover:text-purple-300 transition"
                              title="Edit item"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              onClick={() => handleDelete(item)}
                              className="text-red-400 hover:text-red-300 transition"
                              title="Move to recently deleted"
                            >
                              <Trash2 size={17} />
                            </button>
                          </>
                        )}

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
            className="px-3 py-1.5 text-sm bg-[#151b27] rounded-lg disabled:opacity-40 hover:bg-purple-600 transition"
          >
            Previous
          </button>

          <span className="text-gray-300 text-sm">
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="px-3 py-1.5 text-sm bg-[#151b27] rounded-lg disabled:opacity-40 hover:bg-purple-600 transition"
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
                      className="w-full mt-1.5 bg-[#080b12] border border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:border-purple-500"
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
                  className="w-full mt-1.5 bg-[#080b12] border border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:border-purple-500"
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
                  className="w-full mt-1.5 bg-[#080b12] border border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 py-2.5 rounded-lg text-sm font-semibold transition"
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