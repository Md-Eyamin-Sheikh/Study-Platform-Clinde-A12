import React, { useState, useEffect, useContext } from 'react';
import { Edit, Trash2, Save, X, FileText, Calendar, Search, Filter } from 'lucide-react';
import { AuthContext } from '../../../../providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const ManageNotes = () => {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (user?.email) {
      fetchNotes();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortNotes();
  }, [notes, searchTerm, sortBy]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`https://study-hub-survar-a12.vercel.app/api/notes/${user.email}`);
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

  const filterAndSortNotes = () => {
    let filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredNotes(filtered);
  };

  const handleEdit = (note) => {
    setEditingNote({ ...note });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://study-hub-survar-a12.vercel.app/api/notes/${editingNote._id}`, {
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
      const response = await fetch(`https://study-hub-survar-a12.vercel.app/api/notes/${noteId}`, {
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <FileText className="w-8 h-8 text-green-100" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Manage Notes</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} in your collection
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-50 rounded-2xl shadow-lg p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notes by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-black border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="relative bg-green-50">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-3 text-black px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">By Title</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No matching notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first note to get started!'}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {editingNote && editingNote._id === note._id ? (
                    <div className="p-6">
                      <input
                        type="text"
                        value={editingNote.title}
                        onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-4 font-semibold text-gray-900 focus:border-green-500 focus:outline-none"
                        placeholder="Note title"
                      />
                      <textarea
                        value={editingNote.description}
                        onChange={(e) => setEditingNote({ ...editingNote, description: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-900 focus:border-green-500 focus:outline-none resize-none"
                        rows="6"
                        placeholder="Note content"
                      />
                      <div className="flex flex-col sm:flex-row gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleUpdate}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEditingNote(null)}
                          className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors flex items-center justify-center"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 mr-2">
                            {note.title}
                          </h3>
                          <div className="flex gap-2 flex-shrink-0">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(note)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(note._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-4 mb-4">
                          {note.description}
                        </p>
                      </div>
                      <div className="px-6 py-4 bg-gray-50 border-t">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          Created {new Date(note.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageNotes;
