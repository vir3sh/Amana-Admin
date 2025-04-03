import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "../assets/FlowerList.css";

const FlowerList = () => {
  const [flowers, setFlowers] = useState([]);
  const [name, setName] = useState("");
  const [available, setAvailable] = useState(false);
  const [editingFlower, setEditingFlower] = useState(null);
  const [deleteFlowerId, setDeleteFlowerId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/flowers`,
          { headers: { Authorization: `Bearer ${getAuthToken()}` } }
        );
        setFlowers(res.data);
      } catch (error) {
        console.log(error);
        alert("Failed to fetch flowers!");
      }
    };
    fetchFlowers();
  }, []);

  const handleSaveFlower = async () => {
    if (!name) return alert("Flower name cannot be empty!");
    try {
      if (editingFlower) {
        const res = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/flowers/${editingFlower._id}`,
          { name, available },
          { headers: { Authorization: `Bearer ${getAuthToken()}` } }
        );
        setFlowers(
          flowers.map((flower) =>
            flower._id === editingFlower._id ? res.data : flower
          )
        );
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/flowers`,
          { name, available },
          { headers: { Authorization: `Bearer ${getAuthToken()}` } }
        );
        setFlowers([...flowers, res.data]);
      }
      setEditingFlower(null);
      setName("");
      setAvailable(false);
    } catch (error) {
      console.log(error);
      alert("Failed to save flower!");
    }
  };

  const handleDelete = async () => {
    if (!deleteFlowerId) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/flowers/${deleteFlowerId}`,
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );
      setFlowers(flowers.filter((flower) => flower._id !== deleteFlowerId));
      setDeleteFlowerId(null);
      setShowDeleteDialog(false);
    } catch (error) {
      console.log(error);
      alert("Delete failed!");
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (id) => {
    setDeleteFlowerId(id);
    setShowDeleteDialog(true);
  };

  return (
    <div className="min-h-screen bg-[#1e5738] flex flex-col text-white p-4 mobile-container">
      {/* Form Card - Always at top on mobile */}
      <Card className="w-full bg-white shadow-md rounded-lg text-black mb-6">
        <CardHeader>
          <CardTitle className="text-[#27724D] text-xl">
            {editingFlower ? "Edit Flower" : "Add Flower"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label className="text-base">Flower Name</Label>
            <Input
              type="text"
              placeholder="Enter Flower Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 text-base bg-gray-100 border border-transparent focus:ring-2 focus:ring-gray-300 transition-all"
            />
            <div className="flex items-center space-x-4">
              <span className="text-base">Availability</span>
              <button
                onClick={() => setAvailable(!available)}
                className={`w-12 h-6 flex items-center rounded-full transition-colors ${
                  available ? "bg-green-500" : "bg-red-500"
                } p-1`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    available ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <Button
              className="w-full text-base py-2 bg-[#fcb040] text-white"
              onClick={handleSaveFlower}
            >
              {editingFlower ? "Update Flower" : "Add Flower"}
            </Button>
            {editingFlower && (
              <Button
                className="w-full text-base py-2 bg-gray-500 text-white mt-2"
                onClick={() => {
                  setEditingFlower(null);
                  setName("");
                  setAvailable(false);
                }}
              >
                Cancel Editing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Flowers List - Below form on mobile */}
      <Card className="w-full bg-white shadow-md rounded-lg text-black">
        <CardHeader>
          <CardTitle className="text-[#27724D] text-xl">Flower List</CardTitle>
        </CardHeader>
        <CardContent>
          {flowers.length === 0 ? (
            <p className="text-center text-gray-500 text-base">
              No flowers available.
            </p>
          ) : (
            <div className="mobile-flower-list">
              {flowers.map((flower) => (
                <div
                  key={flower._id}
                  className="mobile-flower-item p-3 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-base">{flower.name}</h3>
                      <span
                        className={`text-sm font-semibold ${
                          flower.available ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {flower.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingFlower(flower);
                          setName(flower.name);
                          setAvailable(flower.available);
                          // Scroll to top to edit
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="text-sm px-3 py-1 bg-black hover:bg-[#383737] text-white"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => openDeleteDialog(flower._id)}
                        className="text-sm px-3 py-1 text-white bg-black hover:bg-[#383737]"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="bg-white text-black p-4 rounded-lg">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="py-4">Are you sure you want to delete this flower?</p>
            <DialogFooter className="flex justify-end space-x-2">
              <Button 
                onClick={() => setShowDeleteDialog(false)}
                className="bg-gray-500 text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDelete} 
                className="bg-red-600 text-white"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FlowerList;