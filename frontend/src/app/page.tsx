"use client";

import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask } from "../services/taskService";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    const data = await getTasks();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return alert("Title is required");

    await createTask(newTask);
    setNewTask({ title: "", description: "", status: "pending" });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query);

    const matchesStatus = statusFilter === "" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen text-black rounded-[50px]">
      <h1 className="text-3xl font-bold mb-6">Task Manager</h1>

      {/* Task Form */}
      <form
        onSubmit={handleAddTask}
        className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newTask.title}
          onChange={handleInputChange}
          required
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newTask.description}
          onChange={handleInputChange}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          name="status"
          value={newTask.status}
          onChange={handleInputChange}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </form>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task Table */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <p>No tasks match your search or filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="border border-gray-300 px-4 py-2">{task.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{task.description}</td>
                  <td className="border border-gray-300 px-4 py-2 capitalize">
                    {task.status.replace("-", " ")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
