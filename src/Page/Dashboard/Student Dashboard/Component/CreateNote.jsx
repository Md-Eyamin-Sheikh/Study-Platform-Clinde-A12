import React, { useState, useContext, useEffect } from 'react';
import { Save } from 'lucide-react';
import { AuthContext } from '../../../../providers/AuthProvider';
import Swal from 'sweetalert2';

const CreateNote = () => {
  const { user } = useContext(AuthContext);
  const [note, setNote] = useState({
    email: '',
    title: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setNote(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      });

      const data = await response.json();
      if (data.success) {
        setNote({ ...note, title: '', description: '' });
        Swal.fire('Success!', 'Note created successfully!', 'success');
      } else {
        Swal.fire('Error!', 'Failed to create note', 'error');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      Swal.fire('Error!', 'Failed to create note', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='bg-green-50'>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Note</h2>
      
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={note.email}
            readOnly
            className="w-full border rounded-lg px-3 text-black py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={note.description}
            onChange={(e) => setNote({ ...note, description: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {submitting ? 'Creating...' : 'Create Note'}
        </button>
      </form>
    </div>
  );
};

export default CreateNote;
