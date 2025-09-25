import React, { useState, useEffect, useContext } from 'react';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { AuthContext } from '../../../../providers/AuthProvider';
import Swal from 'sweetalert2';

const ManageNotes = () => {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`https://study-hub-survar-a12-rtaxnv1a2-01775012014s-projects.vercel.app/api/notes/${user.email}`);
      const data = await response.json();
      
      if (data.success) {
        setNotes(data.notes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setEditingNote({ ...note });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://study-hub-survar-a12-rtaxnv1a2-01775012014s-projects.vercel.app/api/notes/${editingNote._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingNote.title,
          description: editingNote.description
        })
      });

      const data = await response.json();
      if (data.success) {
        setEditingNote(null);
        fetchNotes();
        Swal.fire('Success!', 'Note updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error updating note:', error);
      Swal.fire('Error!', 'Failed to update note', 'error');
    }
  };

  const handleDelete = async (noteId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`https://study-hub-survar-a12-rtaxnv1a2-01775012014s-projects.vercel.app/api/notes/${noteId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        fetchNotes();
        Swal.fire('Deleted!', 'Note deleted successfully!', 'success');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      Swal.fire('Error!', 'Failed to delete note', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading notes...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Personal Notes</h2>
      
      {notes.length === 0 ? (
        <div className="text-center py-8 text-gray-900">
          No notes found. Create your first note!
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note._id} className="border rounded-lg p-4">
              {editingNote && editingNote._id === note._id ? (
                <div>
                  <input
                    type="text"
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                    className="w-full border text-gray-950 rounded px-3 py-2 mb-3 font-semibold"
                  />
                  <textarea
                    value={editingNote.description}
                    onChange={(e) => setEditingNote({ ...editingNote, description: e.target.value })}
                    className="w-full border text-gray-950 rounded px-3 py-2 mb-3"
                    rows="4"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingNote(null)}
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 flex items-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(note)}
                        className="text-green-600 hover:text-green-800 flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="text-red-600 hover:text-red-800 flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1 " />
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{note.description}</p>
                  <p className="text-sm text-gray-900">
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageNotes;
