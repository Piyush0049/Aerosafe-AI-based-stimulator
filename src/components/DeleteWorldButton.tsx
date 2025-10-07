"use client";

export function DeleteWorldButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this world?")) return;
    await fetch(`/api/worlds/${id}`, { method: "DELETE" });
    location.reload();
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition"
    >
      Delete
    </button>
  );
}
