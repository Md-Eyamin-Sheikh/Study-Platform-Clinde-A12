import React, { useState, useEffect, useContext } from 'react';
import { Eye, Star } from 'lucide-react';
import { AuthContext } from '../../../../providers/AuthProvider';
import BookedSessionDetail from './BookedSessionDetail';
import Swal from 'sweetalert2';

const ViewBookedSessions = () => {
  const { user } = useContext(AuthContext);
  const [bookedSessions, setBookedSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchBookedSessions();
    }
  }, [user]);

  const fetchBookedSessions = async () => {
    try {
      const response = await fetch(`https://study-hub-survar-a12.vercel.app/api/student/booked-sessions/${user.email}`);
      const data = await response.json();
      
      if (data.success) {
        setBookedSessions(data.bookedSessions);
      }
    } catch (error) {
      console.error('Error fetching booked sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedSession) {
    return (
      <BookedSessionDetail 
        session={selectedSession} 
        onBack={() => setSelectedSession(null)} 
      />
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading booked sessions...</div>;
  }

  return (
    <div className="bg-green-100 pt-4 lg:p-8 min-h-screen">
      <div className='bg-green-100 max-w-7xl mx-auto'>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 p-3">My Booked Sessions</h2>
        
        {bookedSessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No booked sessions found.
          </div>
        ) : (
          <div className="grid gap-6">
            {bookedSessions.map((booking) => (
              <div key={booking._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {booking.sessionDetails?.title || booking.sessionTitle}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Tutor: {booking.tutorEmail}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Fee: {booking.registrationFee === 0 ? 'Free' : `$${booking.registrationFee}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      Booked on: {new Date(booking.bookedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSession(booking)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
   
  );
};

export default ViewBookedSessions;
