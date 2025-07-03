import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery, useMutation } from "@tanstack/react-query";

const ManageAdmins = () => {
  const axiosSecure = useAxiosSecure();
  const [searchEmail, setSearchEmail] = useState("");
  const [queryEmail, setQueryEmail] = useState("");

  // Fetch users by email
  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["user-search", queryEmail],
    queryFn: async () => {
      if (!queryEmail) return [];
      const res = await axiosSecure.get(`/users/search?email=${queryEmail}`);
      return res.data;
    },
    enabled: !!queryEmail,
    retry: false,
  });

  // Mutation to change role
  const {
    mutate: changeUserRole,
    isPending: isMutating,
  } = useMutation({
    mutationFn: async ({ id, role }) => {
      const res = await axiosSecure.patch(`/users/${id}/role`, { role });
      return { ...res.data, role };
    },
    onSuccess: (data) => {
      if (data.modifiedCount > 0) {
        Swal.fire("Success", `User role updated to ${data.role}`, "success");
        refetch();
      }
    },
    onError: () => {
      Swal.fire("Error", "Failed to update role", "error");
    },
  });

  // Trigger search
  const handleSearch = () => {
    if (searchEmail.trim()) {
      setQueryEmail(searchEmail.trim());
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Admins</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by email"
          className="input input-bordered w-full max-w-md"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {isLoading && <p>Loading user info...</p>}
      {isError && (
        <p className="text-red-500">No users found with that email.</p>
      )}

      {users.length > 0 && (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="border p-4 rounded shadow bg-white max-w-xl"
            >
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(user.created_at).toLocaleString()}
              </p>

              <div className="mt-4 flex gap-2">
                {user.role !== "admin" ? (
                  <button
                    className="btn btn-success btn-sm"
                    disabled={isMutating}
                    onClick={() =>
                      changeUserRole({ id: user._id, role: "admin" })
                    }
                  >
                    Make Admin
                  </button>
                ) : (
                  <button
                    className="btn btn-error btn-sm"
                    disabled={isMutating}
                    onClick={() =>
                      changeUserRole({ id: user._id, role: "user" })
                    }
                  >
                    Remove Admin
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;
